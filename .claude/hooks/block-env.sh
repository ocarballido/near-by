#!/usr/bin/env bash
# PreToolUse: bloquea el acceso a ficheros .env* (excepto .env.template).
# Cubre Read|Edit|Write (por file_path), Grep (por path) y Bash (cualquier comando que referencie .env).
# Exit 2 = bloquea la llamada y muestra stderr a Claude.

deny() {
    echo "Bloqueado: el acceso a ficheros .env* no está permitido (solo .env.template). $1" >&2
    exit 2
}

# Sin jq no se puede inspeccionar la llamada: se bloquea en vez de dejar pasar.
command -v jq >/dev/null 2>&1 || deny "jq no está disponible, no se puede comprobar la llamada."

input=$(cat)
tool=$(printf '%s' "$input" | jq -r '.tool_name // empty')

case "$tool" in
    Read | Edit | Write | Grep)
        if [[ "$tool" == "Grep" ]]; then
            path=$(printf '%s' "$input" | jq -r '.tool_input.path // empty')
            glob=$(printf '%s' "$input" | jq -r '.tool_input.glob // empty')
        else
            path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
            glob=""
        fi
        base=$(basename "$path")
        if [[ "$base" == .env* && "$base" != ".env.template" ]]; then
            deny "Fichero: $path"
        fi
        # Grep: el glob también puede apuntar a .env* (p. ej. "**/.env*").
        if [[ -n "$glob" ]]; then
            globbase=$(basename "$glob")
            if [[ "$globbase" == .env* && "$globbase" != ".env.template" ]]; then
                deny "Glob: $glob"
            fi
        fi
        ;;
    Bash)
        cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')
        # Quitar .env.template (permitido) y buscar cualquier otra referencia a .env
        # (no coincide con process.env, .environment ni similares).
        stripped=$(printf '%s' "$cmd" | sed -E 's/\.env\.template//g')
        if printf '%s' "$stripped" | grep -Eq '(^|[^A-Za-z0-9_])\.env([^A-Za-z0-9_-]|$)'; then
            deny "El comando referencia .env."
        fi
        ;;
esac

exit 0
