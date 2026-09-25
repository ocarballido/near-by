#!/usr/bin/env bash
# PreToolUse (Edit|Write): bloquea la edición de migraciones de supabase/migrations/ ya versionadas en git.
# Las migraciones nuevas (sin versionar) se pueden editar. Una migración aplicada nunca se modifica: se crea otra.
# Exit 2 = bloquea la llamada y muestra stderr a Claude.

deny() {
    echo "Bloqueado: $1" >&2
    exit 2
}

deny_tracked() {
    deny "no se puede modificar una migración ya versionada; crea una nueva con 'npx supabase migration new <nombre>'. $1"
}

# Sin jq no se puede inspeccionar la llamada: se bloquea en vez de dejar pasar.
command -v jq >/dev/null 2>&1 || deny "jq no está disponible, no se puede comprobar la llamada."

input=$(cat)
path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
[[ -z "$path" ]] && exit 0

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
[[ "$path" != /* ]] && path="$project_dir/$path"

case "$path" in
    "$project_dir"/supabase/migrations/*) ;;
    *) exit 0 ;;
esac

git -C "$project_dir" ls-files --error-unmatch -- "$path" >/dev/null 2>&1
status=$?

# 0 = versionado → bloquear; 1 = sin versionar → permitir; otro = error de git → bloquear por precaución.
case "$status" in
    0) deny_tracked "Fichero: $path" ;;
    1) exit 0 ;;
    *) deny "no se pudo comprobar con git si la migración está versionada (código $status). Fichero: $path" ;;
esac
