// IMSHEALTH GLOBAL TECHNOLOGY INNOVATION
// IMSHEALTH VISUALIZATION HACKATHON LONDON 2015
// PRASHANT PATEL

      window.addEventListener("load", function() {
        var POWER = 0.6;
        var totalSales = 0;
        var parentWeight = 0;
        var lastZoomedTo = undefined;

        var foamtree = new CarrotSearchFoamTree({
          id: "visualization",
          pixelRatio: window.devicePixelRatio || 1,

          rolloutDuration: 0,
          pullbackDuration: 0,
          fadeDuration: 0,

          relaxationQualityThreshold: 6,

          relaxationInitializer: "fisheye",

          onModelChanging: function(dataObject) {
            CarrotSearchFoamTree.TreeModel.eachDescendantAndSelf(dataObject, function(group, index, parent, level) {
              if (!group.label) {
                group.label = group.id + "";
              }

              if (group.weight) {
                group.weight = Math.pow(group.weight, POWER);
              }
            });
          },

          descriptionGroupPolygonDrawn: true,
          groupBorderWidth: 0,
          groupInsetWidth: 0,
          groupSelectionOutlineColor: "#343d46",
          groupSelectionOutlineShadowSize: 0,
          groupSelectionOutlineShadowColor: "#343d46",
          groupFillType: "plain",
          groupFillGradientRadius: 1.2,
          groupFillGradientCenterLightnessShift: 30,
          groupFillGradientRimLightnessShift: 0,
          groupStrokeType: "plain",
          groupStrokeWidth: 0,
          groupStrokePlainLightnessShift: -20,
          groupStrokeGradientLowerLightnessShift: 0,
          groupHoverStrokeLightnessShift: 10,
          groupExposureShadowColor: "#000",
          groupUnexposureLightnessShift: -50,
          groupUnexposureLabelColorThreshold: 0.15,
          rainbowStartColor: "hsla(  0, 100%, 55%, 1)", 
          rainbowEndColor: "hsla(360, 100%, 55%, 1)",
          attributionPosition: 45,
          groupMinDiameter: 0,
          groupLabelMinFontSize: 3,
          groupLabelFontFamily : "Open Sans",
          groupBorderRadius: 0,
          parentFillOpacity: 0.9,
          groupSelectionOutlineWidth: 2,
          wireframeLabelDrawing: "always",
          maxGroupLevelsDrawn: 4,
          maxGroupLabelLevelsDrawn: 3,
          rainbowSaturationCorrection: 0.7,

          onGroupDoubleClick: function(e) {
            e.preventDefault();
            var group = e.secondary ? e.bottommostOpenGroup : e.topmostClosedGroup;
            var toZoom;
            if (group) {
              this.open({
                groups: group,
                open: !e.secondary
              });
              toZoom = e.secondary ? group.parent : group;
            } else {
              toZoom = this.get("dataObject");
            }
            if (group.level == 5)
              this.expose(group)
            else
              this.zoom(toZoom);
            lastZoomedTo = toZoom;
          },

          /* for touch screens */
          onGroupClick : function(e) {
            //e.preventDefault();
            var group = e.secondary ? e.bottommostOpenGroup : e.topmostClosedGroup;
            parentWeight = group.parent.weight;
            var percentage = 0;
            totalSales = 38270937736;
            var sales = Math.round(Math.pow(group.weight,(1/POWER)),2);
            var parentSales = Math.round(Math.pow(parentWeight,(1/POWER)),2);
            if (group.level == 1)
              percentage = sales / totalSales;
            else
              percentage = sales / parentSales;
            var salesCurrency = numeral(sales).format('$0.0a');
            var salesPercentage = numeral(percentage).format('0.00%');

            var salesTemplate = Template.make("<h1 id='metricstext'><%- atcLevel %></h1>" +
            "<h5>ATC Level</h5>" + 
            "<h1 id='metricstext'><%- atcLabel %></h1>" +
            "<h5>ATC Description</h5>" +
            "<h1 id='metricstext'><%- atcSales %></h1>" +
            "<h5>Sales</h5>" +
            "<h1 id='metricstext'><%- atcMarketShare %></h1>" +
            "<h5>Market Share at ATC Level <%- atcLevel %></h5>");

            $("#salesMetrics").html(salesTemplate({
              atcLevel : group.level,
              atcLabel: group.label,
              atcSales : salesCurrency,
              atcMarketShare : salesPercentage
            }));
          },

/*
          onGroupHover: function(e) {
            e.preventDefault();
            var group = e.secondary ? e.bottommostOpenGroup : e.topmostClosedGroup;
            parentWeight = group.parent.weight;
            var percentage = 0;
            totalSales = 38270937736;
            var sales = Math.round(Math.pow(group.weight,(1/POWER)),2);
            var parentSales = Math.round(Math.pow(parentWeight,(1/POWER)),2);
            if (group.level == 1)
              percentage = sales / totalSales;
            else
              percentage = sales / parentSales;
            var salesCurrency = numeral(sales).format('0.0a');
            var salesPercentage = numeral(percentage).format('0.00%');

            var salesTemplate = Template.make("<h1 id='metricstext'><%- atcLevel %></h1>" +
            "<h5>ATC Level</h5>" + 
            "<h1 id='metricstext'><%- atcLabel %></h1>" +
            "<h5>ATC Description</h5>" +
            "<h1 id='metricstext'><%- atcSales %></h1>" +
            "<h5>Sales</h5>" +
            "<h1 id='metricstext'><%- atcMarketShare %></h1>" +
            "<h5>Market Share at ATC Level <%- atcLevel %></h5>");

            $("#salesMetrics").html(salesTemplate({
              atcLevel : group.level,
              atcLabel: group.label,
              atcSales : salesCurrency,
              atcMarketShare : salesPercentage
            }));
          },
*/          
          groupContentDecorator: function (opts, params, vars) {
            var ctx = params.context;
            var centerX = params.polygonCenterX;
            var scratch = ctx.scratch();

            var info = scratch.fillPolygonWithText(
              params.polygon,
              centerX, params.labelBoxTop + params.labelBoxHeight,
              params.group.id,
              {
                maxFontSize: params.labelFontSize, // restrict max font size
                verticalAlign: "top", // flow the text downwards from the center point
                verticalPadding: 0.5, // use some smaller than default padding
                maxTotalHeight: 1 // use the full available height
              });

            if (info.fit) {
              var labelBox = info.box;
              var boxMargin = labelBox.h * 0.1;
              ctx.roundRect(labelBox.x - 2 * boxMargin, labelBox.y - boxMargin,
                labelBox.w + 4 * boxMargin, labelBox.h + 2 * boxMargin, boxMargin * 2);

              ctx.globalAlpha = 0.15;
              ctx.fill();
              ctx.globalAlpha = 0.25;
              ctx.lineWidth = boxMargin * 0.3;
              ctx.stroke();

              ctx.globalAlpha = 1.0;
              scratch.replay(ctx);
            }
          },
 
 /*         
          titleBarDecorator: function (opts, params, vars) {
            vars.titleBarShown = true;

            if (params.group.level == 1){
              totalSales = 38270937736;
            }
            else{
              totalSales = Math.round(Math.pow(parentWeight,(1/POWER)),2);
            }
            var sales = Math.round(Math.pow(params.group.weight,(1/POWER)),2);
            var percentage = sales / totalSales;
            var salesPercentage = numeral(percentage).format('0.00%');
            var salesCurrency = numeral(sales).format('$0,0');

            vars.titleBarText = params.group.label + " | " + salesCurrency + " | " + salesPercentage;
          },
 */ 
          groupLabelDecorator: function(opts, params, vars) {
            //if (params.hasChildren && params.browseable === false) {
                //vars.labelText += "\n[" + params.group.id + "]";
            //}
/*            if (params.group.level == 5){
              var totalSales = Math.round(Math.pow(lastZoomedTo.weight,(1/POWER)),2);
              vars.labelText += "\n[" + totalSales + "]";
            }*/
          },

          onKeyUp: function(event) {
            if (event.keyCode === 27) {
              event.preventDefault();
              foamtree.set("zoomMouseWheelEasing", "squareInOut");
              foamtree.set("zoomMouseWheelDuration", Math.max(2000, lastZoomedTo.level * 25));
              this.zoom(this.get("dataObject")).then(this.reset);
              foamtree.set("zoomMouseWheelDuration", CarrotSearchFoamTree.defaults.zoomMouseWheelDuration);
              foamtree.set("zoomMouseWheelEasing", CarrotSearchFoamTree.defaults.zoomMouseWheelEasing);
              lastZoomedTo = undefined;
            }
          },

          onViewReset: function() {
            lastZoomedTo = undefined;
          }
        });

        window.addEventListener("orientationchange", foamtree.resize);

        window.addEventListener("resize", (function() {
          var timeout;
          return function() {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(foamtree.resize, 300);
          }
        })());

        initDatasets([{
          url : 'assets/data/atc.js',
          label : "ATC Classification"
        }]);
        initAutocomplete();

        $("#form").submit(function(e) {
          e.preventDefault();

          var query = $("#search").val();
          if ($.trim(query).length > 0) {
            var group = CarrotSearchFoamTree.TreeModel.findFirstByProperty(
              foamtree.get("dataObject"), "label", query);

            if (group) {
              zoomToGroup(group);
            }
          } else {
            zoomToGroup(foamtree.get("dataObject"));
          }
        });

        $("body")
          .on("click", "a.dataset", function(e) {
            e.preventDefault();
            loadDataSet(this.href);
          })
          .on("click", "a[href = '#zoom-out']", function(e) {
            e.preventDefault();
            zoomToGroup(foamtree.get("dataObject"));
          })
          .on("click", "a.go", function(e) {
            e.preventDefault();
            var id = this.hash.substring(1);
            var group = CarrotSearchFoamTree.TreeModel.findFirstByProperty(foamtree.get("dataObject"), "id", id);
            if (group) {
              zoomToGroup(group);
            }
          });

        $("a.dataset:eq(0)").trigger("click");

        function initDatasets(datasets) {
          var template = Template.make("<a href='<%- url %>' class='dataset'><%- label %></a>");

          $("#datasets").html(datasets.reduce(function(html, ds) {
            html += template(ds);
            return html;
          }, ""));
        }

        function loadDataSet(dataSetUrl) {
          // Initiate loading of the data
          var $loading = $("#loading").show();
          var $ui = $("#ui").hide();
          JSONP.load(dataSetUrl, "modelDataAvailable", function(dataObject) {
            prepareDirectLinks(dataObject, ["VIRAL HEPATITIS PRODUCTS", "STATINS (HMG-COA RED)", "ATYPICAL ANTIPSYCHOTICS"]);

            $loading.hide();
            $ui.show();
            lastZoomedTo = undefined;

            setTimeout(function() {
              foamtree.set("dataObject", dataObject);
            }, 100);
          });
        }

        function prepareDirectLinks(dataObject, byName) {
          var template = Template.make("<a class='go' href='#<%- id %>'><%- label %></a>");
          var templateWithLevel = Template.make("<a class='go' href='#<%- id %>'><%- label %> (level:&nbsp;<%- level %>)</a>");
          var templateWithChildren = Template.make("<a class='go' href='#<%- id %>'><%- label %> (children:&nbsp;<%- children %>)</a>");

          var count = 0,
            numLeafGroups = 0,
            numNonLeafGroups = 0,
            maxChildren = 0;
          CarrotSearchFoamTree.TreeModel.eachDescendantAndSelf(dataObject, function(group, index, parent, level) {
            if (group.id === undefined) {
              group.id = count;
            }
            group.parent = parent;
            group.level = level;
            group.children = group.groups ? group.groups.length : 0;

            if (maxChildren < group.children) {
              maxChildren = group.children;
            }
            count++;
            if (group.children > 0) {
              numNonLeafGroups++;
            } else {
              numLeafGroups++;
            }
          });

          var html = "";

          // Named groups
          html += "<div>Groups by name: " +
            byName.reduce(function(html, name) {
              var group = CarrotSearchFoamTree.TreeModel.findFirstByProperty(dataObject, "label", name);
              if (group) {
                html += template(group);
              }
              return html;
            }, "") + "</div>";

          // Deepest nesting level
          var maxLevel = 0,
            maxLevelGroups = [];
          CarrotSearchFoamTree.TreeModel.eachDescendantAndSelf(dataObject, function(group, index, parent, level) {
            if (maxLevel < level) {
              maxLevel = level;
            }
          });
          var maxLevelTmp = maxLevel;
          for (var i = 0; i < 4; i++) {
            CarrotSearchFoamTree.TreeModel.eachDescendantAndSelf(dataObject, function(group, index, parent, level) {
              if (group.label && level === maxLevelTmp) {
                maxLevelGroups.push(group);
                return false;
              }
            });
            maxLevelTmp -= Math.ceil(maxLevelTmp / 20);
          }

          html += "<div>Deeply nested groups: " + maxLevelGroups.reduce(function(html, group) {
            html += templateWithLevel(group);
            return html;
          }, "") + "</div>";

          // Many children
          var maxChildrenGroups = [];
          CarrotSearchFoamTree.TreeModel.eachDescendantAndSelf(dataObject, function(group, index, parent, level) {
            if (group.label) {
              maxChildrenGroups.push(group);
            }
          });
          maxChildrenGroups.sort(function(a, b) {
            return b.children - a.children
          });

          html += "<div>Groups with many children: " + maxChildrenGroups.slice(0, 5).reduce(function(html, group) {
            html += templateWithChildren(group);
            return html;
          }, "") + "</div>";

          $("#direct").html(html);

          var statsTemplate = Template.make("<dl class='dl-horizontal dl-wide'>" +
            "<dt>Total number groups:</dt><dd><%- numGroups %></dd>" +
            "<dt>Non-leaf groups:</dt><dd><%- numNonLeafGroups %></dd>" +
            "<dt>Leaf groups:</dt><dd><%- numLeafGroups %></dd>" +
            "<dt>Deepest nesting level:</dt><dd><%- maxLevel %></dd>" +
            "<dt>Max children in one group:</dt><dd><%- maxChildren %></dd>" +
            "</dl>");

          $("#stats").html(statsTemplate({
            numGroups: count,
            numNonLeafGroups: numNonLeafGroups,
            numLeafGroups: numLeafGroups,
            maxLevel: maxLevel,
            maxChildren: maxChildren
          }));
        }

        function zoomToGroup(target) {
          if (target === lastZoomedTo) {
            return;
          }

          if (!lastZoomedTo) {
            lastZoomedTo = foamtree.get("dataObject");
          }

          var common = lowestCommonAncestor(lastZoomedTo, target);

          var targetParents = allParents(target);
          targetParents.pop();

          foamtree.open(targetParents).then(function() {
            while (target.parent && !foamtree.get("state", target.parent).browseable) {
              target = target.parent;
            }

            foamtree.set("zoomMouseWheelEasing", "squareInOut");
            foamtree.set("zoomMouseWheelDuration", Math.max(2000, (lastZoomedTo.level - common.level) * 50));
            foamtree.zoom(common).then(function() {
              foamtree.open({
                groups: target,
                open: false
              });
              foamtree.set("zoomMouseWheelDuration", Math.max(2000, (target.level - common.level) * 100));

              foamtree.zoom(target);
              foamtree.set("zoomMouseWheelDuration", CarrotSearchFoamTree.defaults.zoomMouseWheelDuration);
              foamtree.set("zoomMouseWheelEasing", CarrotSearchFoamTree.defaults.zoomMouseWheelEasing);
            });
            lastZoomedTo = target;
          });
        }

        function lowestCommonAncestor(groupA, groupB) {
          var parentsA = allParents(groupA);
          var parentsB = allParents(groupB);

          var max = Math.min(parentsA.length, parentsB.length);
          for (var i = 0; i < max; i++) {
            if (parentsA[i] !== parentsB[i]) {
              // We assume the two nodes do have one common parent
              return parentsA[i - 1];
            }
          }

          return parentsA[max - 1];
        }

        function allParents(group) {
          var parents = [];
          var parent = group;
          while (parent) {
            parents.push(parent);
            parent = parent.parent;
          }
          parents.reverse();
          return parents;
        }


        function initAutocomplete() {
          var templates = {
            suggestion: Template.make("<div><%- group.label %><small>id: <%- group.id %></small><small>level: <%- group.level %></small></div>")
          };

          $('#search').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
          }, {
            name: 'labels',
            displayKey: 'value',
            source: foamTreeSource("label"),
            templates: templates
          }, {
            name: 'ids',
            displayKey: 'value',
            source: foamTreeSource("id"),
            templates: templates
          });

          function foamTreeSource(prop) {
            return function findMatches(q, cb) {
              var matches = [];
              q = q.toLowerCase();

              CarrotSearchFoamTree.TreeModel.eachDescendantAndSelf(foamtree.get("dataObject"), function(group) {
                var val = (group[prop] + "");
                var index = val.toLocaleLowerCase().indexOf(q);
                if (index >= 0) {
                  matches.push({
                    value: val,
                    index: index,
                    group: group
                  });
                }
              });

              matches.sort(function(a, b) {
                if (a.index != b.index) {
                  return a.index - b.index;
                } else {
                  if (a.group.label < b.group.label) {
                    return -1;
                  } else if (a.group.label > b.group.label) {
                    return 1;
                  } else {
                    return 0;
                  }
                }
              });

              cb(matches.slice(0, 20));
            };
          }
        }
      });