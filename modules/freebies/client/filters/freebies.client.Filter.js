(function () {
  'use strict';

  angular
    .module('freebies')
    .filter('myFreebies', myFreebies);

  myFreebies.$inject = [];

  function myFreebies(input, freebies, filterStuff) {
    return function (input, freebies, filterStuff) {
      var filtered = [];
      var flag = false;
      console.log(input);
      console.log("In Filter");
      console.log(freebies);
      console.log("Filter Stuff");
      console.log(filterStuff);

      if (filterStuff.categories.length === 0) {
        return input;
      } else {
        _.forEach(input, function(freebieToFilter, key) {
          flag = false;
          _.forEach(freebieToFilter.categories, function(category, key) {
            console.log(category);
            _.forEach(filterStuff.categories, function(cat, key) {
              if (category.name === cat.name) {
                console.log(category.name);
                flag = true;
              }
            });
          });
          if (flag === true) {
            filtered.push(freebieToFilter);
          }
        });
        console.log(filtered);
        return filtered;
      }
      // if (filterStuff.categories.length === 0 && (!filterStuff.terms)) {
      //   console.log("NO TERMS");
      //   return input;
      // } else {
      //   // console.log(freebies);
      //   console.log(filterStuff);
      //   _.forEach(freebies, function(freebie, key) {
      //     if (freebie.terms === filterStuff.terms) {
      //       console.log(freebie.terms);
      //       if (filterStuff.categories.length === 0) {
      //         filtered.push(freebie);
      //       } else if (filterStuff.categories.length > 0) {
      //       _.forEach(freebie.categories, function(category, key) {
      //         _.forEach(filterStuff.categories, function(cat, key) {
      //           console.log(cat.name);
      //           if (cat.name === category.name) {
      //             filtered.push(freebie);
      //
      //           }
      //         });
      //       });
      //      }
      //     }
      //   });
      //   // Freebies directive logic
      //   // ...
      //   return filtered;
      // }
    };
  }
}());
