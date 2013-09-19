   function SaveAll() {
        var modules = []
        for(var i in currentModules) {
            modules[i] = Serialize(currentModules[i])
        } 
        var request = {
            id : userdocId,
            action : "save",
            modules : modules,
        }
        $.get('ActionServlet', request, function(responseText) {
            if (request["action"] == "save") {
                userdocId = responseText;
            }
        });
    }

    function LoadAll() {
        $.get('ActionServlet', {"action" : "load"}, function(response) {
            // Remove controls from UI.
            for (var i in currentModules) {
                var m = currentModules[i];  
                m.control.parentNode.removeChild(m.control);
            }
            // Clear modules array.
            currentModules = []
            // Create new modules that downloaded from DB.
            for (var i in response) {
                var m = Deserialize(response[i])
                createModule(m)
            }
        });
    }
