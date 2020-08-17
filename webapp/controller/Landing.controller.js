sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Core",
	"sap/m/MessageToast",
	"sap/ndc/BarcodeScanner"
], function (Controller, JSONModel, Fragment, UIComponent, Core, MessageToast, BarcodeScanner) {
	"use strict";

	return Controller.extend("inc.inkthn.neo.NEO_VMS.controller.Landing", {
		onInit: function () {

			var comboData = {
				"FeedbackVisibility": false,
				"BtnsVisibility": true,
				"gifVisibility": false
			};
			var oModel1 = new JSONModel(comboData);
			this.getView().setModel(oModel1, "oVisibleModel");
			var oLoginModel = this.getOwnerComponent().getModel("oLoginModel");
			this.getView().setModel(oLoginModel, "oLoginModel");
		},

		//Login As Employee
		onPressLogin: function (oEvent) {
			var oDialog = this.byId("BusyDialog");
			oDialog.open();
			setTimeout(function () {
				oDialog.close();
			}, 5500);
			var username = this.getView().getModel("oLoginModel").getProperty("/eId");
			var password = this.getView().getModel("oLoginModel").getProperty("/password");
			var that = this;
			var sUrl = "/JAVA_SERVICE/employee/login";
			var item = {
				"username": username,
				"password": password
			};
			$.ajax({
				url: sUrl,
				type: "POST",
				dataType: "json",
				data: {
					"data": JSON.stringify(item)
				},
				// beforeSend: function (xhr) {
				// 	var param = "/JAVA_SERVICE_CF";
				// 	var token = that.getCSRFToken(sUrl, param);
				// 	xhr.setRequestHeader("X-CSRF-Token", token);
				// 	xhr.setRequestHeader("Accept", "application/json");
				// },
				success: function (oData) {
					if (oData.status === true) {
						if (oData.role === "Employee") {
							var eId = oData.eid;
							var image = oData.image;
							var name = oData.name;

							that.getView().getModel("oHostModel").setProperty("/eId", eId);
							that.getView().getModel("oHostModel").setProperty("/image", image);
							that.getView().getModel("oHostModel").setProperty("/name", name);

							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("RouteHost");
						} else if (oData.role === "Admin") {
							var eId1 = oData.eid;
							var image1 = oData.image;
							var name1 = oData.name;
							that.getView().getModel("oAdminModel").setProperty("/eId", eId1);
							that.getView().getModel("oAdminModel").setProperty("/image", image1);
							that.getView().getModel("oAdminModel").setProperty("/name", name1);

							var oRouter1 = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter1.navTo("RouteAdmin");
						} else if (oData.role === "Security") {
							var eId2 = oData.eid;
							var image2 = oData.image;
							var name2 = oData.name;
							that.getView().getModel("oSecurityModel").setProperty("/eId", eId2);
							that.getView().getModel("oSecurityModel").setProperty("/image", image2);
							that.getView().getModel("oSecurityModel").setProperty("/name", name2);

							var oRouter2 = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter2.navTo("RouteSecurity");
						}
						sap.m.MessageToast.show("Logged In Successfully!");
					} else if (oData.status === false) {
						sap.m.MessageToast.show("User doesn't exist");
					}
				},
				error: function (e) {
					var oValue = that.getView().byId("idEmpPass").getValue();
					if (oValue === "AAAA" || oValue === "SSAVK") {
						var eId = that.getView().getModel("oLoginModel").getProperty("/eId");
						that.getView().getModel("oHostModel").setProperty("/eId", eId);
						var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter.navTo("RouteHost");

					} else if (oValue === "AKR") {
						var oRouter1 = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter1.navTo("RouteAdmin");
					} else if (oValue === "JG") {
						var oRouter2 = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter2.navTo("RouteSecurity");
					}
					sap.m.MessageToast.show("Server Not Responding");
				}

			});
		},

		//Existing Visitor
		onPressVerify: function () {
			var that = this;

			var vhId = this.getView().getModel("oLoginModel").getProperty("/visitorid");
			var sUrl = "/JAVA_SERVICE/visitor/sendOtp";
			var item = {
				vhId: vhId
			};
			$.ajax({
				url: sUrl,
				data: item,

				dataType: "json",
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
					var oRouter6 = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter6.navTo("RouteExistingVisitor");
				},
				success: function (data) {
					if (data.status === 200) {
						if (!that._oDialog1) {
							that._oDialog1 = sap.ui.xmlfragment("idOnotp", "inc.inkthn.neo.NEO_VMS.fragments.EnterOtp", that);
						}
						that.getView().addDependent(that._oDialog1);
						that._oDialog1.open();
					} else if (data.status === 100) {
						sap.m.MessageToast.show("checked in");
						if (!that._oDialog2) {
							that._oDialog2 = sap.ui.xmlfragment("idcheckoutfrag", "inc.inkthn.neo.NEO_VMS.fragments.CheckedOut", that);
						}
						that.getView().addDependent(that._oDialog2);
						that._oDialog2.open();
					} else if (data.status === 500) {
						sap.m.MessageToast.show("Could Not Send");
					}
				},
				type: "POST"
			});
		},
		onVerifyOtp: function () {
			var that = this;
			that._oDialog1.close();
			var oLoginModel = this.getOwnerComponent().getModel("oLoginModel");
			var OTP = sap.ui.core.Fragment.byId("idOnotp", "otp").getValue();
			var vhId = this.getView().getModel("oLoginModel").getProperty("/visitorid");
			var item = {
				vhId: vhId,
				OTP: OTP

			};
			var sUrl = "/JAVA_SERVICE/visitor/verification";
			$.ajax({
				url: sUrl,
				data: item,
				dataType: "json",
				error: function (err) {
					sap.m.MessageToast.show("Error");

				},
				success: function (data) {
					if (data.status === 200) {
						sap.m.MessageToast.show("User Verified");
						var oRouter6 = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter6.navTo("RouteExistingVisitor");
						var sUrl2 = "/JAVA_SERVICE/visitor/getVisitorDetails?vhId=" + vhId;
						$.ajax({
							url: sUrl2,
							data: null,
							async: true,
							cache: false,
							dataType: "json",
							contentType: "application/json; charset=utf-8",
							error: function (err) {
								sap.m.MessageToast.show("Destination Failed");
							},
							success: function (data1) {
								var ExvhId = data1.vhId;
								var visitorName = data1.visitorName;
								var eId = data1.eId;
								var email = data1.email;
								var contactNo = data1.contactNo;
								var puprose = data1.puprose;
								var organisation = data1.organisation;
								var hostName = data1.hostName;
								var date = data1.date;
								var proofType = data1.proofType;
								var proofNo = data1.proofNo;
								oLoginModel.setProperty("/ExvhId", ExvhId);
								oLoginModel.setProperty("/ExeId", eId);
								oLoginModel.setProperty("/ExvisitorName", visitorName);
								oLoginModel.setProperty("/Exemail", email);
								oLoginModel.setProperty("/ExcontactNo", contactNo);
								oLoginModel.setProperty("/Expuprose", puprose);
								oLoginModel.setProperty("/Exorganisation", organisation);
								oLoginModel.setProperty("/ExhostName", hostName);
								oLoginModel.setProperty("/Exdate", date);
								oLoginModel.setProperty("/ExpersonalIdType", proofType);
								oLoginModel.setProperty("/ExidentityNo", proofNo);

							},
							type: "GET"
						});
					} else if (data.status === 300) {
						sap.m.MessageToast.show("Otp Expired Please Try Again");

					} else if (data.status === 500) {
						sap.m.MessageToast.show("Could Not Verify");
					}

				},
				type: "POST"
			});

		},
		onPressCheckOut: function () {

			var that = this;

			var vhId = this.getView().getModel("oLoginModel").getProperty("/visitorid");
			var feedback = sap.ui.core.Fragment.byId("idcheckoutfrag", "idFeedback").getValue();
			var rating = sap.ui.core.Fragment.byId("idcheckoutfrag", "idRating").getValue();
			var item = {
				vhId: vhId,
				feedback: feedback,
				rating: rating

			};
			var sUrl = "/JAVA_SERVICE/visitor/addFeedback";

			$.ajax({
				url: sUrl,
				data: {
					"data": JSON.stringify(item)
				},
				dataType: "json",
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					if (data.status === 200) {
						sap.m.MessageToast.show("Feedback Sent Successful");

					} else if (data.status === 500) {
						sap.m.MessageToast.show("Something Happened Wrong");
					}
				},
				type: "POST"
			});

			var item = {
				vhId: vhId
			};
			var sUrl = "/JAVA_SERVICE/visitor/checkout";

			$.ajax({
				url: sUrl,
				data: item,
				dataType: "json",
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					if (data.status === 200) {
						sap.m.MessageToast.show("CheckedOut  Successful");
						if (!that._oDialog9) {
							that._oDialog9 = sap.ui.xmlfragment("idfeedBackSuccess", "inc.inkthn.neo.NEO_VMS.fragments.ExistSuccess", that);
						}
						that.getView().addDependent(that._oDialog9);
						that._oDialog9.open();

					} else if (data.status === 500) {
						sap.m.MessageToast.show("Something Happened Wrong");
					}
				},
				type: "POST"
			});

		},
	
		onCheckOutCancel: function () {
			var that = this;
			that._oDialog2.close();
			sap.ui.core.Fragment.byId("idcheckoutfrag", "idFeedback").setValue("");
			sap.ui.core.Fragment.byId("idcheckoutfrag", "idRating").setValue("");
		},
		onSuccess: function () {
			var that = this;

			that._oDialog2.close();
			that._oDialog9.close();

		},
		//New Visitor
		onNewVisitor: function () {
			var oDialog = this.byId("BusyDialog");
			oDialog.open();
			setTimeout(function () {
				oDialog.close();
			}, 1000);
			var oRouter3 = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter3.navTo("RouteNewVisitor");

		},
		// onScanBarcode:function(oEvent){
		// 	sap.ndc.BarcodeScanner.scan(
		// 		function(mResult) {
		// 			alert("We got a bar code\n" +
		// 				"Result: " + mResult.text + "\n" +
		// 				"Format: " + mResult.format + "\n" +
		// 				"Cancelled: " + mResult.cancelled);
		// 		},
		// 		function(Error) {
		// 			alert("Scanning failed: " + Error);
		// 		},
		// 	);
		// },
		handleBarcodeScannerSuccess: function (oEvent) {
			var that = this;
			jQuery.sap.require("sap.ndc.BarcodeScanner");
			sap.ndc.BarcodeScanner.scan(
				function (mResult) {
					alert("We got a bar code\n" +
						"Result: " + mResult.text + "\n" +
						"Format: " + mResult.format + "\n" +
						"Cancelled: " + mResult.cancelled);
					var qrCode = mResult.text;
					that.getView().getModel("oLoginModel").setProperty("/visitorid", qrCode);
				},
				function (Error) {
					alert("Scanning failed: " + Error);
				}
			);
		}

	});
});