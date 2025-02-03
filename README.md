# For macOS
brew install bufbuild/buf/buf

# For Linux
curl -sSL \
  "https://github.com/bufbuild/buf/releases/download/v1.28.1/buf-$(uname -s)-$(uname -m)" \
  -o "buf" && \
  chmod +x buf && \
  sudo mv buf /usr/local/bin/buf
