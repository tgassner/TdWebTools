<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function realEnvValue(string $key): ?string
{
    foreach ([$_ENV, $_SERVER] as $source) {
        if (array_key_exists($key, $source) && is_scalar($source[$key])) {
            return (string) $source[$key];
        }
    }

    $value = getenv($key, true);
    return $value === false ? null : $value;
}

function parseEnvLine(string $line): ?array
{
    $line = trim($line);
    if ($line === '' || strpos($line, '#') === 0) {
        return null;
    }
    if (strpos($line, 'export ') === 0) {
        $line = trim(substr($line, 7));
    }

    $position = strpos($line, '=');
    if ($position === false) {
        return null;
    }

    $key = trim(substr($line, 0, $position));
    $value = trim(substr($line, $position + 1));
    if ($key === '' || preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $key) !== 1) {
        return null;
    }

    if (strlen($value) >= 2 && (($value[0] === '"' && substr($value, -1) === '"') || ($value[0] === "'" && substr($value, -1) === "'"))) {
        $value = substr($value, 1, -1);
    } else {
        $value = preg_replace('/\s+#.*$/', '', $value) ?? $value;
        $value = rtrim($value);
    }

    return [$key, $value];
}

function loadEnvFile(string $file, array &$values): void
{
    if (!is_file($file) || !is_readable($file)) {
        return;
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $pair = parseEnvLine($line);
        if ($pair !== null) {
            $values[$pair[0]] = $pair[1];
        }
    }
}

function loadEnvConfig(): array
{
    $values = [];
    $explicit = realEnvValue('MAILQUEUE_ENV_FILE');
    if ($explicit !== null && trim($explicit) !== '') {
        loadEnvFile(trim($explicit), $values);
        return $values;
    }

    loadEnvFile(__DIR__ . '/.env', $values);

    $name = realEnvValue('APP_ENV');
    if ($name === null) {
        $name = $values['APP_ENV'] ?? 'dev';
    }
    $name = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $name) ?? '';
    if ($name !== '') {
        loadEnvFile(__DIR__ . '/.env.' . $name, $values);
    }

    return $values;
}

function config(array $env, string $key, string $default = ''): string
{
    $value = realEnvValue($key);
    if ($value !== null) {
        return $value;
    }

    $value = $env[$key] ?? $default;
    return is_scalar($value) ? (string) $value : $default;
}

function configInt(array $env, string $key, int $default, int $min, int $max): int
{
    $value = filter_var(config($env, $key, (string) $default), FILTER_VALIDATE_INT);
    if ($value === false) {
        return $default;
    }

    return max($min, min($max, $value));
}

$env = loadEnvConfig();

$SERVER         = config($env, 'DB_SERVER', 'DBHOST\SQLEXPRESS');
$DATABASE       = config($env, 'DB_DATABASE', 'SouMatrixx_EC3');
$USER           = config($env, 'DB_USER', 'mailqueue_ro');
$PASSWORD       = config($env, 'DB_PASSWORD', 'CHANGE_ME');
$WRITE_USER     = config($env, 'DB_WRITE_USER', 'mailqueue_rw');
$WRITE_PASSWORD = config($env, 'DB_WRITE_PASSWORD', 'CHANGE_ME');
$TIMEOUT        = configInt($env, 'DB_TIMEOUT', 10, 1, 60);
$LIMIT          = configInt($env, 'DB_LIMIT', 500, 1, 5000);
$TRUST_CERT     = filter_var(config($env, 'DB_TRUST_SERVER_CERTIFICATE', '0'), FILTER_VALIDATE_BOOLEAN);

$SQL = 'SELECT TOP (' . $LIMIT . ')
            ID, ObjectId, State, Timestamp, Priority,
            ErrorMsg, ObjectType, ItemArt, ItemID, ContentJson
        FROM dbo.GroupwareTransfer
        ORDER BY ID DESC';

function respond(array $payload, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestInt(array $data, array $keys, int $min, int $max, string $label): int
{
    $value = null;
    foreach ($keys as $key) {
        if (array_key_exists($key, $data)) {
            $value = $data[$key];
            break;
        }
    }

    $int = filter_var($value, FILTER_VALIDATE_INT, [
        'options' => [
            'min_range' => $min,
            'max_range' => $max,
        ],
    ]);
    if ($int === false) {
        throw new RuntimeException($label . ' muss eine ganze Zahl zwischen ' . $min . ' und ' . $max . ' sein.');
    }

    return $int;
}

function readJsonRequest(): array
{
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || $raw === '') {
        throw new RuntimeException('Kein JSON-Body übermittelt.');
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        throw new RuntimeException('Ungültiger JSON-Body.');
    }

    return $data;
}

function jsonStringValue(string $json, string $key): ?string
{
    $pattern = '/"' . preg_quote($key, '/') . '"\s*:\s*"((?:\\\\.|[^"\\\\])*)"/i';
    if (preg_match($pattern, $json, $matches) !== 1) {
        return null;
    }

    $value = json_decode('"' . $matches[1] . '"', true);
    return is_string($value) ? $value : $matches[1];
}

function extractContentMeta($json): array
{
    if (!is_string($json) || $json === '') {
        return ['dokumentNr' => null, 'filename' => null];
    }

    return [
        'dokumentNr' => jsonStringValue($json, 'dokumentNr'),
        'filename' => jsonStringValue($json, 'filename'),
    ];
}

function jsonBinaryValue(string $json): ?string
{
    if (preg_match('/"binary"\s*:\s*"/i', $json, $m, PREG_OFFSET_CAPTURE) !== 1) {
        return null;
    }

    $start = $m[0][1] + strlen($m[0][0]);
    $tail = substr($json, $start);
    if (preg_match('/[A-Za-z0-9+\/=\r\n]+/', $tail, $b) !== 1) {
        return null;
    }

    return $b[0];
}

function safeDownloadFilename(string $name, string $fallback = 'download.bin'): string
{
    $name = str_replace(["\0", "\r", "\n", '"', '\\', '/', ':', '*', '?', '<', '>', '|'], '_', $name);
    $name = trim($name, " .\t\n\r\0\x0B");
    if ($name === '') {
        $name = $fallback;
    }

    return $name;
}

function downloadContentType(string $filename, string $bytes): string
{
    if (strncmp($bytes, '%PDF', 4) === 0) {
        return 'application/pdf';
    }

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return match ($ext) {
        'pdf' => 'application/pdf',
        'txt' => 'text/plain; charset=UTF-8',
        'xml' => 'application/xml; charset=UTF-8',
        'json' => 'application/json; charset=UTF-8',
        default => 'application/octet-stream',
    };
}

function slimContentJson($json)
{
    if (!is_string($json) || $json === '') {
        return $json;
    }

    $data = json_decode($json, true);
    if (!is_array($data)) {
        $json = preg_replace('/"binary"\s*:\s*"[^"]*(?:"|$)/i', '"binary":"[entfernt]"', $json) ?? $json;
        $json = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $json) ?? $json;
        return substr($json, 0, 20000);
    }

    $clean = static function ($value) use (&$clean) {
        if (!is_array($value)) {
            return $value;
        }

        $result = [];
        foreach ($value as $key => $item) {
            $result[$key] = $key === 'binary' ? '[entfernt]' : $clean($item);
        }

        return $result;
    };

    return json_encode($clean($data), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
}

try {
    if (!in_array('sqlsrv', PDO::getAvailableDrivers(), true)) {
        throw new RuntimeException('PDO-Treiber sqlsrv ist nicht installiert.');
    }

    $dsn = 'sqlsrv:Server=' . $SERVER . ';Database=' . $DATABASE . ';LoginTimeout=' . $TIMEOUT
        . ($TRUST_CERT ? ';TrustServerCertificate=yes' : '');
    $isPost = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
    $pdoUser = $isPost ? $WRITE_USER : $USER;
    $pdoPassword = $isPost ? $WRITE_PASSWORD : $PASSWORD;
    $pdo = new PDO($dsn, $pdoUser, $pdoPassword, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    if ($isPost) {
        $payload = readJsonRequest();
        $id = requestInt($payload, ['id', 'ID'], 1, PHP_INT_MAX, 'ID');
        $state = requestInt($payload, ['state', 'State'], -32768, 32767, 'State');

        $update = $pdo->prepare('UPDATE dbo.GroupwareTransfer SET State = ? WHERE ID = ?', [
            PDO::SQLSRV_ATTR_QUERY_TIMEOUT => $TIMEOUT,
        ]);
        $update->execute([$state, $id]);

        if ($update->rowCount() === 0) {
            respond(['ok' => false, 'error' => 'Keine Zeile mit dieser ID gefunden.'], 404);
        }

        respond(['ok' => true, 'id' => $id, 'state' => $state]);
    }

    $downloadId = $_GET['download'] ?? null;
    if ($downloadId !== null && $downloadId !== '') {
        if (!ctype_digit((string) $downloadId) || (int) $downloadId < 1) {
            respond(['ok' => false, 'error' => 'Ungültige Download-ID.'], 400);
        }

        $stmt = $pdo->prepare('SELECT TOP (1) ID, ContentJson FROM dbo.GroupwareTransfer WHERE ID = ?', [
            PDO::SQLSRV_ATTR_QUERY_TIMEOUT => $TIMEOUT,
        ]);
        $stmt->execute([(int) $downloadId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            respond(['ok' => false, 'error' => 'Keine Zeile mit dieser ID gefunden.'], 404);
        }

        $content = $row['ContentJson'] ?? '';
        if (!is_string($content) || $content === '') {
            respond(['ok' => false, 'error' => 'Kein ContentJson vorhanden.'], 404);
        }

        $meta = extractContentMeta($content);
        $filename = safeDownloadFilename($meta['filename'] ?? '', 'groupwaretransfer-' . $row['ID'] . '.bin');
        $binary = jsonBinaryValue($content);
        if ($binary === null) {
            respond(['ok' => false, 'error' => 'Kein binary-Feld im ContentJson gefunden.'], 404);
        }

        $normalized = preg_replace('/\s+/', '', $binary) ?? '';
        $bytes = base64_decode($normalized, true);
        if ($bytes === false) {
            $normalized = strtr($normalized, '-_', '+/');
            $pad = strlen($normalized) % 4;
            if ($pad > 0) {
                $normalized .= str_repeat('=', 4 - $pad);
            }
            $bytes = base64_decode($normalized, true);
        }
        if ($bytes === false) {
            respond(['ok' => false, 'error' => 'Binary konnte nicht dekodiert werden.'], 422);
        }

        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        header('Content-Type: ' . downloadContentType($filename, $bytes));
        header('Content-Disposition: attachment; filename="' . addcslashes($filename, "\"\\") . '"; filename*=UTF-8\'\'' . rawurlencode($filename));
        header('X-Content-Type-Options: nosniff');
        header('Content-Length: ' . strlen($bytes));
        echo $bytes;
        exit;
    }

    $stmt = $pdo->prepare($SQL, [
        PDO::SQLSRV_ATTR_QUERY_TIMEOUT => $TIMEOUT,
    ]);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cleanRows = [];
    foreach ($rows as $row) {
        $content = $row['ContentJson'] ?? null;
        $meta = extractContentMeta($content);
        $clean = [];

        foreach ($row as $key => $value) {
            if ($key === 'ContentJson') {
                $clean['DokumentNr'] = $meta['dokumentNr'];
                $clean['Filename'] = $meta['filename'];
                $clean['ContentJson'] = slimContentJson($value);
            } else {
                $clean[$key] = $value;
            }
        }

        $cleanRows[] = $clean;
    }
    $rows = $cleanRows;

    respond(['ok' => true, 'count' => count($rows), 'rows' => $rows]);
} catch (Throwable $e) {
    respond([
        'ok'    => false,
        'error' => 'Datenbankfehler: ' . $e->getMessage(),
    ], 500);
}
