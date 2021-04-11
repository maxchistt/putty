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
<code>cd && mkdir -p /home/std/${data.gitapp} </code><br>
<code>cd && git clone git@github.com:${data.gituser}/${data.gitapp}.git && cd </code><br>
нужно обратить внимание, успешно ли скопировались данные с гита<br>
<code>cd && cd ${data.gitapp} && npm install && cd <br></code>

<br>
<p class="font-weight-bold">На случай если у нас node.js</p>
редактируем файлы конфигурации <br>
<code>sudo nano /home/std/ecosystem.config.js</code> <br><br>
<span>
'env'- переменные окуружения<br>
значение PORT указываем 3000, если приложение одно, и 3001 и т.д., если приложений уже несколько<br>
вместо index.js свой исполняемый файл<br><br>
<pre><code>
module.exports = {
  apps : [
    /*...*/
    {
      'name':'${data.app}',
      'script': './${data.gitapp}/index.js',
      'watch': 'true',
      'ignore-watch':"./${data.gitapp}/node_modules",
      'ignore-watch':"node_modules",
      'max-memory-restart':'150MB',
      'env':{
        'PORT':'3000',
        'NODE_ENV':'env',
      }
    }
    /*...*/
  ],
};
</code></pre>
<br>
</span>
<code>cd && pm2 restart ecosystem.config.js </code><br>
<code>pm2 save </code><br>
<br>
<code>pm2 list</code>
<br><br>

<p class="font-weight-bold">На случай если у нас только React</p>

<code>cd && cd ${data.gitapp} && npm run build</code>
редактируем файлы конфигурации <br>
<code>sudo nano /home/std/ecosystem.config.js</code> <br><br>
<span>
значение -p указываем 3000, если приложение одно, и 3001 и т.д., если приложений уже несколько<br><br>
<pre><code>
module.exports = {
  apps : [
    /*...*/
    {
      name      : "${data.app}",
      script    : "npx",
      interpreter: "none",
      args: "serve ${data.gitapp}/build -s -p 3000",
      'watch': './${data.gitapp}/',
      'ignore-watch': "./${data.gitapp}/node_modules",
      'max-memory-restart': '150MB',
      env_production : {
        NODE_ENV: 'production'
      }
    }
    /*...*/
  ],
};
</code></pre>
<br>
</span>

<code>cd && pm2 restart ecosystem.config.js</code> <br>
<code>pm2 save </code><br>
<br>
<code>pm2 list</code>
<br><br>

<p class="font-weight-bold">Далее</p>

${Number($("#set-nginxmode").val()) == 0 ? fit_set_server() : nginx_set_server()}

<p class="font-weight-bold">Для обновления с гитхаба - подготовка</p>
<code>cat>>update-${data.gitapp}.sh</code><br>
Далее вводим в файл
<span>
для node.js<br>
<code>cd && cd ${data.gitapp} && git reset --hard HEAD && git pull && npm install && cd && pm2 restart ecosystem.config.js && cd</code><br>
для react<br>
<code>cd && cd ${data.gitapp} && git reset --hard HEAD && git pull && npm install && npm run build && cd && pm2 restart ecosystem.config.js && cd</code><br>
</span>
нажимаем Enter, затем Ctrl+C<br>
<code>chmod +x update-${data.gitapp}.sh</code><br>
<br>
<p class="font-weight-bold">Команда для обновления:</p>
<code>./update-${data.gitapp}.sh</code>
<br><br>
`;

let nginx_set_server = () => `

sudo nano /etc/nginx/sites-available/default <br><br>
<span>
тут важно исправить std-1033 на номер для своего сервера<br>
в proxy_pass указываем порт, указанный в предыдущем файле<br><br>
<code><pre>
...
server {
  listen 80;
  server_name ${data.app}.std-1033.ist.mospolytech.ru;
  location / {
    proxy_pass http://std-1033.ist.mospolytech.ru:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
...
</code></pre>
<br>
</span>
sudo sv restart nginx <br><br>
приложение будет доступно по ссылке ${data.app}.std-1033.ist.mospolytech.ru<br><br>
`;

let fit_set_server = () => `

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
<code>
cd && sudo apt update -y && sudo apt upgrade -y <br>
sudo apt install <br>
sudo apt install nano <br>
sudo apt install nodejs <br>
sudo apt install build-essential <br>
sudo apt install git <br><br>

cd && sudo npm install serve@latest -g <br>
cd && sudo npm install pm2@latest -g <br>

pm2 startup systemd </code><br>
нужно выполнить строку из ответа на последнюю команду:<br>
<code>sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u std --hp /home/std <br>
pm2 save <br>
cd && pm2 ecosystem </code><br><br>

${Number($("#set-nginxmode").val()) == 0 ? "" : nginx_start()}
`;

let nginx_start = () => `
<code>
cd && sudo apt install nginx <br>
mkdir -p /etc/nginx/sites-available && mkdir -p /etc/nginx/sites-enabled <br>
sudo nano /etc/nginx/sites-available/default </code><br>
сохраняем нажав ctrl+O затем enter<br>
<code>sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/<br>
sudo nano /etc/nginx/nginx.conf </code><br> 
в конец блока http дописываем <code>include /etc/nginx/sites-enabled/default;</code><br>
если нету, записываем <code>server_names_hash_bucket_size 128;</code><br>
<code>sudo nginx -t<br>
sudo sv restart nginx</code><br><br>
`;