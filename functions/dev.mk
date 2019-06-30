all: install setup

install: \
	node_modules

setup:
	npx --no-install firebase setup:emulators:firestore
	npx --no-install firebase setup:emulators:database

emulator: install ../firebase.json
	npx --no-install firebase emulators:start $(ONLY)

emulator/exec: install ../firebase.json
	npx --no-install firebase emulators:exec $(CMD)

serve: install
	npx --no-install firebase serve

build: install package.json $(shell find src -name '*.ts')
	npx --no-install nodemon $(foreach f,$^,--watch $(f)) --exec "make build || exit 1"

node_modules:
	npm install

clean:
	rm -rf node_modules
	rm -rf .runtimeconfig.json
