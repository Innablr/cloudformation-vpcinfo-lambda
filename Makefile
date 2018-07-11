SOURCES=getVpcInfo.js

getVpcInfo.zip: $(SOURCES) npm_install
	zip -9rq $@ $(SOURCES) node_modules

npm_install:
	npm install

clean:
	rm -rf getVpcInfo.zip node_modules

.PHONY: clean npm_install