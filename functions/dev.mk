all: install setup

install: \
	node_modules

setup:
	npx --no-install firebase setup:emulators:firestore
	npx --no-install firebase setup:emulators:database

emulator: install
	npx --no-install firebase emulators:start $(ONLY)

emulator/exec: install
	npx --no-install firebase emulators:exec $(CMD)

build: install package.json $(shell find src -name '*.ts')
	npx --no-install nodemon $(foreach f,$^,--watch $(f)) --exec "make build || exit 1"

node_modules:
	npm install
