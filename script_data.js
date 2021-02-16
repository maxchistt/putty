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
cd && mkdir -p /home/std/${data.app} <br>
cd && git clone git@github.com:${data.gituser}/${data.gitapp}.git && cd <br>
нужно обратить внимание, успешно ли скопировались данные с гита<br>
cd && cd ${data.app} && npm install && cd <br>
редактируем файлы конфигурации <br>
sudo nano /home/std/ecosystem.config.js <br><br>
<span>
'env'- переменные окуружения<br>
значение PORT указываем 3001 и т.д., если приложений уже несколько<br>
вместо start.js свой исполняемый файл<br><br>
module.exports = {<br>
  <span>
  apps : [<br><span>
    ...<br>
    {<br><span>
      'name':'${data.app}',<br>
      'script': './${data.app}/start.js',<br>
      'watch': 'true',<br>
      'ignore-watch':"./${data.app}/node_modules",<br>
      'ignore-watch':"node_modules",<br>
      'max-memory-restart':'150MB',<br>
      'env':{<br><span>
        'PORT':'3000',<br>
        'NODE_ENV':'env',<br></span>
      }<br></span>
    }<br>
    ...<br></span>
  ],<br>
  </span>
};<br><br>
</span>
cd && pm2 restart ecosystem.config.js <br>
pm2 save <br>
sudo nano /etc/nginx/sites-available/default <br><br>
<span>
тут важно исправить std-1033 на номер для своего сервера<br>
в proxy_pass указываем порт, указанный в предыдущем файле<br><br>
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
...<br><br>
</span>
sudo sv restart nginx <br>
приложение будет доступно по ссылке ${data.app}.std-1033.ist.mospolytech.ru<br><br>

команда для обновления с гитхаба<br>
cd && cd ${data.app} && git pull && cd<br><br>
`;

var firstinstall = () => `<h5>Подготовка сервера к запуску приложений на node.js</h5>
<br>
cd && sudo apt update -y && sudo apt upgrade -y <br>
sudo apt install <br>
sudo apt install nano <br>
sudo apt install nodejs <br>
sudo apt install build-essential <br>
sudo apt install git <br><br>

cd && sudo npm install pm2@latest -g <br>
pm2 startup systemd <br>нужно выполнить строку из ответа на последнюю команду:<br>
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u std --hp /home/std <br>
pm2 save <br>
cd && pm2 ecosystem <br><br>

cd && sudo apt install nginx <br>
mkdir -p /etc/nginx/sites-available && mkdir -p /etc/nginx/sites-enabled <br>
sudo nano /etc/nginx/sites-available/default <br> сохраняем нажав ctrl+O затем enter <br>
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/<br>
sudo nano /etc/nginx/nginx.conf <br> в конец блока http дописываем include /etc/nginx/sites-enabled/default;<br>
если нету, записываем server_names_hash_bucket_size 128;<br>
sudo nginx -t<br>
sudo sv restart nginx<br><br>
`;
