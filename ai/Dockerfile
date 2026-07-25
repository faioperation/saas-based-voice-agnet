FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt ./

# ─────────────────────────────────────────────────────────────
# pywin32 is a Windows-only package listed in requirements.txt.
# It cannot be installed on Linux (the Docker host OS).
# We filter it out before installing to avoid a build failure.
# The conditional line `pywin32; sys_platform == 'win32'` is
# automatically skipped by pip on Linux, but the pinned line
# `pywin32==311` is not conditional, so we remove it manually.
# ─────────────────────────────────────────────────────────────
RUN grep -v "^pywin32==" requirements.txt > /tmp/requirements_linux.txt \
    && pip install --no-cache-dir -r /tmp/requirements_linux.txt

# Copy the rest of the application
COPY . .

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
