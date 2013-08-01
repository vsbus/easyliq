	
function combo(name, options, control, onchange)
{
	this.name = name;
	this.options = options;
	this.control = control;
	this.onchange = onchange;
}
var fmCakeMoistureContent_Combos =[ new combo("Calculate", ["Cake Porosity", "Cake Saturation", "Cake Moisture Content"], null,function(){
	alert("changed");}
)];

function module()
{
}
function module(name, combos, parameters, groups, parameters_meta, groups_meta, calculatedGroup, calculate, onComboChanged)
{
	this.name = name;
	this.combos = combos;
	this.parameters = parameters;
	this.groups = groups;
	this.parameters_meta = parameters_meta;
	this.groups_meta = groups_meta;	
	this.calculatedGroup = calculatedGroup;
	this.calculate = calculate;
	this.onComboChanged = onComboChanged;
}
module.prototype.sayName = function()
{
  alert(this.name);
};
module.prototype.sayCombo = function()
{
  alert(this.combo);
};

function fmCakeMoistureContent(){}; 
fmCakeMoistureContent.prototype = new module(
		"Cake Moisture Content from Cake Saturation",
		fmCakeMoistureContent_Combos,
		["rho_I", "rho_S", "eps", "S", "Rf"],
		null,
		null,
		null,
		null,
		null,
		null);

		