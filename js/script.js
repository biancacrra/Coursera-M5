// Set up a namespace for our utility
var $dc = {};

// Returns an HTTP request object
function getRequestObject() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // For very old IE browsers (optional)
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    global.alert("Ajax is not supported!");
    return null;
  }
}

// Makes an Ajax GET request to 'requestUrl'
$dc.ajaxUtils = {
  sendGetRequest: function (requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    request.onreadystatechange = function () {
      handleResponse(request, responseHandler, isJsonResponse);
    };
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
  }
};

// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request, responseHandler, isJsonResponse) {
  if (request.readyState == 4 && request.status == 200) {
    // Default to isJsonResponse = true
    if (isJsonResponse == undefined) {
      isJsonResponse = true;
    }

    if (isJsonResponse) {
      responseHandler(JSON.parse(request.responseText));
    } else {
      responseHandler(request.responseText);
    }
  }
}

$dc.homeHtmlUrl = "snippets/home-snippet.html";
$dc.allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
$dc.categoriesTitleHtml = "snippets/categories-title-snippet.html";
$dc.categoryHtml = "snippets/category-snippet.html";
$dc.menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
$dc.menuItemsTitleHtml = "snippets/menu-items-title.html";
$dc.menuItemHtml = "snippets/menu-item.html";

$dc.chooseRandomCategory = function (categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
};

$dc.insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

$dc.insertItemPrice = function (html, pricePropName, priceValue) {
  if (!priceValue) {
    return $dc.insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = $dc.insertProperty(html, pricePropName, priceValue);
  return html;
};

$dc.insertItemPortionName = function (html, portionPropName, portionValue) {
  if (!portionValue) {
    return $dc.insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = $dc.insertProperty(html, portionPropName, portionValue);
  return html;
};

$dc.buildAndShowHomeHTML = function (categories) {
  $dc.ajaxUtils.sendGetRequest(
    $dc.homeHtmlUrl,
    function (homeHtml) {
      var chosenCategoryShortName = $dc.chooseRandomCategory(categories).short_name;
      var homeHtmlToInsertIntoMainPage = $dc.insertProperty(homeHtml, "randomCategoryShortName", "'" + chosenCategoryShortName + "'");
      document.querySelector("#main-content").innerHTML = homeHtmlToInsertIntoMainPage;
    },
    false
  );
};

$dc.loadMenuCategories = function () {
  // Implementation for loading menu categories
  // ...

  // For demonstration purposes, I'll just show an alert
  alert("Load Menu Categories function called!");
};

$dc.loadMenuItems = function (categoryShort) {
  // Implementation for loading menu items
  // ...

  // For demonstration purposes, I'll just show an alert
  alert("Load Menu Items function called with categoryShort: " + categoryShort);
};

document.addEventListener("DOMContentLoaded", function (event) {
  $dc.ajaxUtils.sendGetRequest(
    $dc.allCategoriesUrl,
    $dc.buildAndShowHomeHTML
  );
});
