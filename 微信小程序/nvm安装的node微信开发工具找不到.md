```bash
where npm # /Users/herschel/.nvm/versions/node/v14.16.1/bin/npm
 sudo ln -s /Users/herschel/.nvm/versions/node/v14.16.1/bin/npm /usr/local/bin/npm
 
 where node # /Users/herschel/.nvm/versions/node/v14.16.1/bin/node
 sudo ln -s /Users/herschel/.nvm/versions/node/v14.16.1/bin/node /usr/local/bin/node
 
 # 如果出现报错：ln: /usr/local/bin/npm: File exists，命令加上-f
 sudo ln -fs /Users/herschel/.nvm/versions/node/v14.16.1/bin/npm /usr/local/bin/npm
 sudo ln -fs /Users/herschel/.nvm/versions/node/v14.16.1/bin/node /usr/local/bin/node
```

