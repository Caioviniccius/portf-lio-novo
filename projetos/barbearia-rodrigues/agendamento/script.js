(function(){
  "use strict";

  var WHATSAPP_NUMBER = "5574991608952";
  var OPEN_HOUR = 8;
  var CLOSE_HOUR = 20;
  var STEP_MIN = 30;

  var WEEKDAYS = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  var MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

  function pad(n){ return n < 10 ? "0"+n : ""+n; }
  function todayKey(d){ d = d || new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function buildSlots(){
    var out = [];
    var cur = OPEN_HOUR*60;
    var end = CLOSE_HOUR*60;
    while(cur <= end){
      out.push(pad(Math.floor(cur/60))+":"+pad(cur%60));
      cur += STEP_MIN;
    }
    return out;
  }
  var SLOTS = buildSlots();

  function readState(){
    var tag = document.getElementById("bookingState");
    var parsed = { date: null, bookings: {} };
    if(tag){
      try{ parsed = JSON.parse(tag.textContent); }catch(e){}
    }
    if(!parsed || typeof parsed !== "object") parsed = { date: null, bookings: {} };
    if(!parsed.bookings) parsed.bookings = {};
    return parsed;
  }
  var state = readState();

  function effectiveBookings(){
    var now = new Date();
    if(state.date === todayKey(now)) return state.bookings;
    return {};
  }

  var selectedTime = null; // slot currently showing the inline form
  var justConfirmed = null; // time just confirmed, to show success note

  function escapeHtml(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  function slotDateTime(time, base){
    var parts = time.split(":");
    var d = new Date(base.getFullYear(), base.getMonth(), base.getDate(), parseInt(parts[0],10), parseInt(parts[1],10), 0, 0);
    return d;
  }

  function renderDateHeader(){
    var now = new Date();
    var weekday = WEEKDAYS[now.getDay()];
    var full = now.getDate() + " de " + MONTHS[now.getMonth()] + " de " + now.getFullYear();
    document.getElementById("weekdayLabel").textContent = weekday;
    document.getElementById("fulldateLabel").textContent = full;
    document.getElementById("clockLabel").textContent = pad(now.getHours()) + ":" + pad(now.getMinutes());
  }

  function renderSlots(){
    var grid = document.getElementById("slotsGrid");
    var now = new Date();
    var bookings = effectiveBookings();
    var html = "";

    SLOTS.forEach(function(time){
      var dt = slotDateTime(time, now);
      var isPast = dt.getTime() <= now.getTime();
      var booking = bookings[time];
      var isBooked = !!booking;
      var isSelected = selectedTime === time;

      var cls = "slot";
      var statusText = "Disponível";
      if(isBooked){ cls += " is-booked"; statusText = "Reservado" + (booking.name ? " — " + escapeHtml(String(booking.name).split(" ")[0]) : ""); }
      else if(isPast){ cls += " is-past"; statusText = "Encerrado"; }
      else { cls += " is-free"; if(isSelected) cls += " selected"; }

      var clickable = (!isBooked && !isPast);

      html += '<div class="' + cls + '"' + (clickable ? ' data-time="' + time + '" role="button" tabindex="0"' : "") + '>' +
                '<div class="time">' + time + '</div>' +
                '<div class="status">' + statusText + "</div>" +
              "</div>";

      if(isSelected && clickable){
        html += renderForm(time);
      }
    });

    if(justConfirmed){
      html += '<div class="confirm-note"><svg class="icon"><use href="#ic-check"/></svg>' +
              '<div><strong>Agendamento enviado para ' + justConfirmed + '!</strong><br>' +
              "Abrimos o WhatsApp da barbearia com os seus dados preenchidos — é só confirmar o envio da mensagem para garantir o horário.</div></div>";
    }

    grid.innerHTML = html;
  }

  function renderForm(time){
    return '<div class="slot-form" data-form-for="' + time + '">' +
      '<div class="form-title">Confirmar horário <span class="picked-time">— ' + time + "</span></div>" +
      '<div class="form-row">' +
        '<div class="form-field"><label for="nameInput">Nome</label><input id="nameInput" type="text" placeholder="Seu nome" autocomplete="name" /></div>' +
        '<div class="form-field"><label for="phoneInput">WhatsApp</label><input id="phoneInput" type="tel" placeholder="(74) 90000-0000" autocomplete="tel" /></div>' +
      "</div>" +
      '<div class="form-note">Ao confirmar, seu horário é reservado nesta agenda e uma mensagem é preparada para o WhatsApp da barbearia com os detalhes do seu agendamento.</div>' +
      '<div class="form-actions">' +
        '<button type="button" class="btn btn-solid" data-action="confirm" data-time="' + time + '">' +
          '<svg class="icon"><use href="#ic-whatsapp"/></svg> CONFIRMAR E ENVIAR' +
        "</button>" +
        '<button type="button" class="btn btn-outline" data-action="cancel">CANCELAR</button>' +
      "</div>" +
    "</div>";
  }

  function render(){
    renderDateHeader();
    renderSlots();
  }

  function waLink(time, name, phone){
    var now = new Date();
    var full = now.getDate() + " de " + MONTHS[now.getMonth()] + " de " + now.getFullYear();
    var msg = "Olá! Gostaria de confirmar meu agendamento na Barbearia Rodrigues para hoje (" + full + ") às " + time + ". Nome: " + (name || "-") + (phone ? ", WhatsApp: " + phone : "") + ".";
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  function confirmBooking(time){
    var nameInput = document.getElementById("nameInput");
    var phoneInput = document.getElementById("phoneInput");
    var name = nameInput ? nameInput.value.trim() : "";
    var phone = phoneInput ? phoneInput.value.trim() : "";

    if(!name){
      nameInput.focus();
      nameInput.style.borderColor = "#c98a8a";
      return;
    }

    var bookings = Object.assign({}, effectiveBookings());
    if(bookings[time]){
      // someone else took it while the form was open
      selectedTime = null;
      state = { date: todayKey(), bookings: bookings };
      render();
      return;
    }
    bookings[time] = { name: name, phone: phone, ts: Date.now() };
    state = { date: todayKey(), bookings: bookings };
    selectedTime = null;
    justConfirmed = time;
    render();

    window.open(waLink(time, name, phone), "_blank");
  }

  document.getElementById("slotsGrid").addEventListener("click", function(e){
    var slotEl = e.target.closest(".slot[data-time]");
    var actionEl = e.target.closest("[data-action]");

    if(actionEl){
      var action = actionEl.getAttribute("data-action");
      if(action === "cancel"){
        selectedTime = null;
        render();
      } else if(action === "confirm"){
        confirmBooking(actionEl.getAttribute("data-time"));
      }
      return;
    }

    if(slotEl){
      var t = slotEl.getAttribute("data-time");
      justConfirmed = null;
      selectedTime = (selectedTime === t) ? null : t;
      render();
    }
  });

  document.getElementById("slotsGrid").addEventListener("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){
      var slotEl = e.target.closest(".slot[data-time]");
      if(slotEl){
        e.preventDefault();
        slotEl.click();
      }
    }
  });

  render();

  // keep the date/time and slot availability fresh without disrupting an open form
  setInterval(function(){
    if(selectedTime) return;
    state = readState();
    render();
  }, 30000);
})();
