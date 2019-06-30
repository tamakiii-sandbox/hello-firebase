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

$(GOOGLE_APPLICATION_CREDENTIALS): secure
	# Go to https://console.cloud.google.com/iam-admin/serviceaccounts and create key
	touch $@

clean:
	rm -rf node_modules
	rm -rf secure
