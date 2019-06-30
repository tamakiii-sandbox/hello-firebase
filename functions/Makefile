GOOGLE_APPLICATION_CREDENTIALS := secure/awsome-project-245310-8936b1356385.json

install: node_modules

setup:
	npx --no-install firebase setup:emulators:firestore
	npx --no-install firebase setup:emulators:database

login: install
	npx --no-install firebase login

deploy: install
	npx --no-install firebase deploy

emulator:
	npx --no-install firebase emulators:start $(ONLY)

emulator/exec:
	npx --no-install firebase emulators:exec $(CMD)

node_modules:
	npm install

secure:
	mkdir -p secure

$(GOOGLE_APPLICATION_CREDENTIALS): secure
	# Go to https://console.cloud.google.com/iam-admin/serviceaccounts and create key
	touch $@

clean:
	rm -rf node_modules
	rm -rf secure
