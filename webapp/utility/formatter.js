jQuery.sap.declare("inc.inkthn.neo.NEO_VMS.utility.formatter");
inc.inkthn.neo.NEO_VMS.utility.formatter = {
	changeType: function (sValue) {
		if (sValue === 0) {
			sValue = "Signature Not Required";
		} else {
			sValue = "Signature Required";
		}
		return sValue;
	}
	};
