GOOGLE_APPLICATION_CREDENTIALS := secure/awsome-project-245310-8936b1356385.json

all: install

install: \
	node_modules

build:
	npx --no-install tsc

login: install
	npx --no-install firebase login

deploy: install
	npx --no-install firebase deploy

node_modules:
	npm install --only=production

secure:
	mkdir -p secure

secure/awsome-project-245310-8936b1356385.json: secure
	# Go to https://console.cloud.google.com/iam-admin/serviceaccounts and create key
	touch $@

.runtimeconfig.json:
	npx --no-install firebase functions:config:get > .runtimeconfig.json

clean-logs:
	rm -rf hs_err_pid*.log
	rm -rf firestore-debug.log
	rm -rf database-debug.log

clean: clean-logs
	rm -rf node_modules
	rm -rf secure
	rm -rf .runtimeconfig.json
