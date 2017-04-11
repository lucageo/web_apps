require({
        async: true,
        packages: [{
                name: "widgetsPath",
                location: "/../../widgets"
            } //i.e. up 2 levels from index.html 
        ]
    }, ["dijit/form/Select", "dojo/store/Memory", "widgetsPath/googleApiClient", "dojo/dom", "dojo/html", "dojo/request/script", "dojo/parser", "dojo/ready", "dijit/layout/ContentPane", "dijit/layout/BorderContainer"],
    function(Select, Memory, GoogleApiClient, dom, html, script, parser, ready) {
        var geeImageServerUrl = "https://geeImageServer.appspot.com";
        ready(function() {
            parser.parse().then(function() {

            }); //startup any widgets in the page

            script.get(geeImageServerUrl + "/getCartTree", {
                jsonp: "callback"
            }).then(function(response) {
                var cart = (response) && (response.records);
                createCartTree(cart);
            });

            function createCartTree(cart) {
                html.set(dom.byId("cartTreeAsR"), cart.tree);
                var client = new GoogleApiClient();
                client.authorise('537433629273-q2f0on91cnsuuckkmtl0pbk24mkg6e3m.apps.googleusercontent.com', 'https://www.googleapis.com/auth/fusiontables https://www.googleapis.com/auth/fusiontables.readonly');
                // client.request('/fusiontables/v2/tables/14hPdnqjG33cm1bF6fdkGRrgt1Sh1fpzXauO2NZ-5').then(function(response) {
                //     console.log(response);
                // });
                client.request('fusiontables/v2/tables', {
                    maxResults: 100,
                }).then(function(response) {
                    // create store instance referencing data from states.json
                    var fusionTablesStore = new Memory({
                        idProperty: "tableId",
                        data: response.result.items
                    });
                    // create Select widget, populating its options from the store
                    var select = new Select({
                        name: "fusionTablesStore",
                        store: fusionTablesStore,
                        style: "width: 200px;",
                        labelAttr: "name",
                        maxHeight: -1, // tells _HasDropDown to fit menu within viewport
                        onChange: function(value) {
                            document.getElementById("value").innerHTML = value;
                            document.getElementById("displayedValue").innerHTML = this.get("displayedValue");
                        }
                    }, "fusionTablesStore");
                    select.startup();
                })
            }
        });
    });
