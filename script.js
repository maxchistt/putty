var data = {};

function setSession() {
  return new Promise((res, rej) => {
    $.ajax({
      url: "",
      type: "POST",
      dataType: "html",
      data: {
        task: "set",
        data: JSON.stringify(data),
      },
    })
      .done(res)
      .catch(rej);
  });
}

function getSession() {
  return new Promise((res, rej) => {
    $.ajax({
      url: "",
      type: "POST",
      dataType: "html",
      data: {
        task: "get",
      },
    })
      .done((json) => {
        let obj = JSON.parse(json);
        //console.log("obj");
        //console.log(obj);
        data = obj instanceof Object ? obj || data : data;
        setValues();
        res();
      })
      .catch(rej);
  });
}

function setValues() {
  $("#set-gituser").val(data.gituser);
  $("#set-gitapp").val(data.gitapp);
  $("#set-app").val(data.app);
  $("#set-nginxmode").val(data.nginx || "0");
}

function setDataChange(e) {
  data[e.target.name] = e.target.value;
  setSession().then(getSession);
}

function selectChange(e) {
  selected = Number(e.target.value);
}

var selected = 1;

$(document).ready(() => {
  getSession().then(setSession);
  $(".datachange").change(setDataChange);
  $("#sel-text").change(selectChange);
  $("#generate").click(generate);
});
