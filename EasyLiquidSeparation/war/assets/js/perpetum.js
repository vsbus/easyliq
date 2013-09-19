    var delay = 0;
    var last_user_action_time = (new Date(2013, 0, 1)).getTime();
    var last_processing_time = (new Date(2013, 0, 1)).getTime();
    
    var currentModules = [];

    function Process() {
        for (var i in currentModules) {
            if (currentModules[i].editTime <= last_processing_time) {
                continue;
            }
            now = new Date()
            timediff = now.getTime() - currentModules[i].editTime;
            if (timediff < delay) {
                continue;
            }
            Calculate(currentModules[i]);
            last_processing_time = now.getTime();
        }
    }
    


    function Serialize(module) {
        var values = {}
        for (p in module.parameters_meta) {
            values[p] = module.parameters_meta[p].value
        }
        var map = {
            name : module.constructor.name,
            position : module.position,
            parameters : values
        }
        return JSON.stringify(map)
    }
    
    function Deserialize(m) {
        var module;
        switch (m.name) {
            case "RfFromCakeSaturation":
                module = new RfFromCakeSaturation();
                break;
            case "DensityConcentration":
                module = new DensityConcentration();
                break;
        }
        module.updateParameters(m.parameters);
        module.id = m.id;
        module.position = m.position;
        return module
    }


    setInterval(Process, delay)