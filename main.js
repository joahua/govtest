(function(document) {
// Data

var experiments = {};

// Profile
var lsKey = "govtest";

addStyles("[variant=default]{display:none}[variant].active {display:block}");

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {

    Array.prototype.slice.call(document.querySelectorAll('[experiment]')).map(function(item){
      experiments[item.getAttribute('experiment')] = makeExperiment(item);
    })

    function makeExperiment(experiment) {
      var items = experiment.querySelectorAll('[variant]');

      return Array.prototype.slice.call(items).map(makeVariant);
    }

    function makeVariant(item) {
      var name = item.getAttribute('variant');

      return {
        "name": name,
        "el": item
      };
    }

    var profile = updateUserProfile(getUserProfile());

    window[lsKey] = {
      activeExperiments: experiments,
      profile: profile
    };
  }
}

function activateExperiment(experiment, variant) {
  experiment[variant].el.classList.add('active');
  experiment.active = experiment[variant].name || variant;
}

function addStyles(css) {
  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);

  return style;
}

function getUserProfile() {
  return JSON.parse(localStorage.getItem(lsKey));
}

function updateUserProfile(profile){
  profile = profile || {};

  for(var exp in experiments)
    if(experiments.hasOwnProperty(exp)){
      if (!profile[exp]) profile[exp] = Math.floor(
          getRandomArbitrary(0, experiments[exp].length)
        );
      activateExperiment(experiments[exp], profile[exp]);
    }

  localStorage.setItem(lsKey, JSON.stringify(profile));
  
  return profile;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
})(document);