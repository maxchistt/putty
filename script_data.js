function generate() {
  let resStr = null;
  switch (selected) {
    case 1:
      resStr = firstinstall();
      break;
    case 2:
      resStr = appinstall();
      break;
    default:
      break;
  }

  $("#result").html(resStr);
}

var appinstall = () => `<h5>Развертывание сервера на Express с загрузкой с github</h5>
<br>
на сервере не должно быть непустой папки и существующего домена с таким названием<br><br>
cd && mkdir -p /home/std/${data.gitapp} <br>
cd && git clone git@github.com:${data.gituser}/${data.gitapp}.git && cd <br>
нужно обратить внимание, успешно ли скопировались данные с гита<br>
cd && cd ${data.gitapp} && npm install && cd <br>

<br>
<p class="font-weight-bold">На случай если у нас node.js</p>
редактируем файлы конфигурации <br>
sudo nano /home/std/ecosystem.config.js <br><br>
<span>
'env'- переменные окуружения<br>
значение PORT указываем 3000, если приложение одно, и 3001 и т.д., если приложений уже несколько<br>
вместо index.js свой исполняемый файл<br><br>
<code>
module.exports = {<br>
  <span>
  apps : [<br><span>
    /*...*/<br>
    {<br><span>
      'name':'${data.app}',<br>
      'script': './${data.gitapp}/index.js',<br>
      'watch': 'true',<br>
      'ignore-watch':"./${data.gitapp}/node_modules",<br>
      'ignore-watch':"node_modules",<br>
      'max-memory-restart':'150MB',<br>
      'env':{<br><span>
        'PORT':'3000',<br>
        'NODE_ENV':'env',<br></span>
      }<br></span>
    }<br>
    /*...*/<br></span>
  ],<br>
  </span>
};<br></code><br>
</span>
cd && pm2 restart ecosystem.config.js <br>
pm2 save <br>
<br><br>
pm2 list
<br><br>

<br>
<p class="font-weight-bold">На случай если у нас только React</p>

cd && cd ${data.gitapp} && npm run build
редактируем файлы конфигурации <br>
sudo nano /home/std/ecosystem.config.js <br><br>
<span>
значение -p указываем 3000, если приложение одно, и 3001 и т.д., если приложений уже несколько<br><br>
<code>
module.exports = {<br><span>
  apps : [<br><span>
    /*...*/<br>
    {<br><span>
      name      : "${data.app}",<br>
      script    : "npx",<br>
      interpreter: "none",<br>
      args: "serve ${data.gitapp}/build -s -p 3000",<br>
      'watch': './${data.gitapp}/',<br>
      'ignore-watch': "./${data.gitapp}/node_modules",<br>
      'max-memory-restart': '150MB',<br>
      env_production : {<br><span>
         NODE_ENV: 'production'<br></span>
        }<br></span>
      }<br>
      /*...*/<br></span>
    ],<br>
    </span>
  };<br></code><br>
  </span>

cd && pm2 restart ecosystem.config.js <br>
pm2 save <br>
<br><br>
pm2 list
<br><br>

<p class="font-weight-bold">Далее</p>

${Number($("#set-nginxmode").val()) == 0 ? fit_set_server() : nginx_set_server()}

команда для обновления с гитхаба<br>
для node.js<br>
cd && cd ${data.gitapp} && git pull && npm install && cd && pm2 restart ecosystem.config.js<br>
для react<br>
cd && cd ${data.gitapp} && git pull && npm install && npm run build && cd && pm2 restart ecosystem.config.js<br>
<br>
`;

let nginx_set_server = () => `
<br>
sudo nano /etc/nginx/sites-available/default <br><br>
<span>
тут важно исправить std-1033 на номер для своего сервера<br>
в proxy_pass указываем порт, указанный в предыдущем файле<br><br>
<code>
...<br>
server {<br>
  <span>
  listen 80;<br>
  server_name ${data.app}.std-1033.ist.mospolytech.ru;<br>
  <br>
  location / {<br><span>
    proxy_pass http://std-1033.ist.mospolytech.ru:3000;<br>
    proxy_set_header Host $host;<br>
    proxy_set_header X-Real-IP $remote_addr;<br>
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;<br>
    proxy_set_header X-Forwarded-Proto $scheme;<br></span>
  }<br>
  </span>
}<br>
...<br></code><br>
</span>
sudo sv restart nginx <br><br>
приложение будет доступно по ссылке ${data.app}.std-1033.ist.mospolytech.ru<br><br>
`;

let fit_set_server = () => `
<br>
заходим на https://fit.mospolytech.ru/systems/servers <br>
<span>
в качестве домена указываем ${data.app} ... <br>
в качестве папки приложения на сервере указываем .../ ${data.gitapp}<br>
указываем порт, указанный в предыдущем файле<br>
</span>
<br>
приложение будет доступно по ссылке ${data.app}.std-1033.ist.mospolytech.ru<br><br>
`;

var firstinstall = () => `
<h5>Подготовка сервера к запуску приложений на node.js</h5>
<br>
cd && sudo apt update -y && sudo apt upgrade -y <br>
sudo apt install <br>
sudo apt install nano <br>
sudo apt install nodejs <br>
sudo apt install build-essential <br>
sudo apt install git <br><br>

cd && sudo npm install serve@latest -g <br>
cd && sudo npm install pm2@latest -g <br>

pm2 startup systemd <br>нужно выполнить строку из ответа на последнюю команду:<br>
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u std --hp /home/std <br>
pm2 save <br>
cd && pm2 ecosystem <br><br>

${Number($("#set-nginxmode").val()) == 0 ? "" : nginx_start()}
`;

let nginx_start = () => `
cd && sudo apt install nginx <br>
mkdir -p /etc/nginx/sites-available && mkdir -p /etc/nginx/sites-enabled <br>
sudo nano /etc/nginx/sites-available/default <br> сохраняем нажав ctrl+O затем enter <br>
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/<br>
sudo nano /etc/nginx/nginx.conf <br> в конец блока http дописываем include /etc/nginx/sites-enabled/default;<br>
если нету, записываем server_names_hash_bucket_size 128;<br>
sudo nginx -t<br>
sudo sv restart nginx<br><br>
`;