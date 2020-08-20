sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, Fragment, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("inc.inkthn.neo.NEO_VMS.controller.NewVisitor", {

		onInit: function () {
			var comboData = {
				"sSelect": "",
				"AddVisVisibility": false,
				"list": [

					{
						"Identity": "Aadhar Card"
					}, {
						"Identity": "PassPort"
					}, {
						"Identity": "Driving License"
					}

				]

			};
			var oModel1 = new JSONModel(comboData);
			this.getView().setModel(oModel1, "oViewModel");
			var oModel4 = new JSONModel("model/VisitorDetails.json");
			this.getView().setModel(oModel4, "oVisitorModel");
			var oVisitorModel1 = this.getOwnerComponent().getModel("oVisitorModel");
			this.getView().setModel(oVisitorModel1, "oVisitorModel1");
			var today = new Date();
			this.getView().getModel("oVisitorModel").setProperty("/date", today);
			var sUrl = "/JAVA_SERVICE/employee/employees";
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				error: function (err) {
					sap.m.MessageToast.show("Destination Failed");
				},
				success: function (data) {
					oVisitorModel1.setProperty("/getEmployeeList", data);
				},
				type: "GET"
			});

		},
		addVis: function () {
			// var PreRegData=this.byId(sap.ui.core.Fragment.createId("idAddItemFrag", "idVisitor").getModel("PreRegData"));
			var oVisitorModel = this.getView().getModel("oVisitorModel");
			var item = oVisitorModel.getProperty("/NewVisitor");
			var obj = {
				"fName": "",
				"lName": "",
				"emailId": "",
				"phoneNo": "",
				"proofType": "",
				"idNo": ""
			};
			oVisitorModel.getData().NewVisitor.push(obj);
			// oVisitorModel.setData({
			// 	"NewVisitor": item
			// });
			oVisitorModel.refresh();

		},
		onSubmit: function () {
			var that = this;
			var firstName = this.getView().getModel("oVisitorModel").getProperty("/firstName");
			var lastName = this.getView().getModel("oVisitorModel").getProperty("/lastName");
			var email = this.getView().getModel("oVisitorModel").getProperty("/email");
			var contactNo = this.getView().getModel("oVisitorModel").getProperty("/contactNo");
			var personalIdType = this.getView().getModel("oVisitorModel").getProperty("/personalIdType");
			var identityNo = this.getView().getModel("oVisitorModel").getProperty("/identityNo");
			var organisation = this.getView().getModel("oVisitorModel").getProperty("/organisation");
			var purpose = this.getView().getModel("oVisitorModel").getProperty("/purpose");
			// var oSplit = this.getView().getModel("oVisitorModel").getProperty("/eId");
			// var sId = oSplit.split("=");
			// var i = sId[1];
			// var eId = parseInt(i, [0]);
			var eId = this.getView().getModel("oVisitorModel").getProperty("/eId");
			var date = this.getView().getModel("oVisitorModel").getProperty("/date");
			var begin = this.getView().getModel("oVisitorModel").getProperty("/begin");
			var end = this.getView().getModel("oVisitorModel").getProperty("/end");
			var Visitor = this.getView().getModel("oVisitorModel").getProperty("/NewVisitor");
			var typeId = 1;
			if (!firstName || !email || !purpose || !end || !begin || !contactNo || !organisation || !date || !eId || !lastName) {
				alert("Please Fill all the Mandatory Details");
			}

			var payload = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				contactNo: contactNo,
				organisation: organisation,
				proofType: personalIdType,
				proofNo: identityNo,
				purpose: purpose,
				typeId: typeId,
				eId: eId,
				date: date,
				begin: begin,
				end: end,

				Visitor: Visitor
			};
			var sUrl = "/JAVA_SERVICE/visitor/newVisitor";
			$.ajax({
				url: sUrl,
				type: "POST",
				dataType: "json",
				async: true,
				data: {
					"data": JSON.stringify(payload)
				},
				// beforeSend: function (xhr) {
				// 	var param = "/JAVA_SERVICE_CF";
				// 	var token = that.getCSRFToken(sUrl, param);
				// 	xhr.setRequestHeader("X-CSRF-Token", token);
				// 	xhr.setRequestHeader("Accept", "application/json");
				// },
				success: function (oData) {
					if (oData.status === 200) {
						sap.m.MessageToast.show("Registered  Successfully");
						if (!that._oDialog1) {
							that._oDialog1 = sap.ui.xmlfragment("idOnSpotSuccess", "inc.inkthn.neo.NEO_VMS.fragments.OnSpotSuccess", that);
						}
						that.getView().addDependent(that._oDialog1);
						that._oDialog1.open();
					}

				},
				error: function (e) {
					sap.m.MessageToast.show("Registration Failed");

				}

			});

		},
		onCancel: function () {

			var oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter1.navTo("RouteLanding");
		},
		onOk: function () {
			this.getView().getModel("oVisitorModel").setProperty("/firstName", "");
			this.getView().getModel("oVisitorModel").setProperty("/lastName", "");
			this.getView().getModel("oVisitorModel").setProperty("/email", "");
			this.getView().getModel("oVisitorModel").setProperty("/contactNo", "");
			this.getView().getModel("oVisitorModel").setProperty("/personalIdType", "");
			this.getView().getModel("oVisitorModel").setProperty("/identityNo", "");
			this.getView().getModel("oVisitorModel").setProperty("/organisation", "");
			this.getView().getModel("oVisitorModel").setProperty("/purpose", "");
			this.getView().getModel("oVisitorModel").setProperty("/eId", "");
			this.getView().getModel("oVisitorModel").setProperty("/date", "");
			this.getView().getModel("oVisitorModel").setProperty("/begin", "");
			this.getView().getModel("oVisitorModel").setProperty("/end", "");
			this.getView().getModel("oVisitorModel").setProperty("/NewVisitor", []);
			var oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter1.navTo("RouteLanding");
		},
		onAddVisible: function () {
			var visibility = this.getView().getModel("oViewModel").getProperty("/AddVisVisibility");
			if (visibility === false) {
				this.getView().getModel("oViewModel").setProperty("/AddVisVisibility", true);
			} else {
				this.getView().getModel("oViewModel").setProperty("/AddVisVisibility", false);
			}
		},
		onVisCancel: function (oEvent) {

			var oItemContextPath = oEvent.getSource().getBindingContext("oVisitorModel").getPath();
			var aPathParts = oItemContextPath.split("/");
			var iIndex = aPathParts[aPathParts.length - 1];

			var oJSONData = this.getView().getModel("oVisitorModel").getProperty("/NewVisitor");
			oJSONData.splice(iIndex, 1);
			this.getView().getModel("oVisitorModel").setProperty("/NewVisitor", oJSONData);

		},

		handleLinkPress: function (evt) {
			MessageBox.information(
				"At Incture, we recognize that privacy of your personal information is important and we take seriously the trust you place in us when you choose to do business with us. Acceptance of the terms of this Privacy Policy is a pre-requisite to visiting this website. If you visit this site, it means you have accepted the terms of this Privacy Policy. We take your privacy seriously and will only use your personal information to administer your account and to provide the products and services you have requested from us. Incture is committed to protecting and respecting your data privacy. We want you to know how we use and protect your personal information. This includes informing you of your rights regarding your personal information that we hold. This Privacy Policy sets out how we may use, process and store your personal information. This privacy policy is an electronic record, in the form of an electronic contract, formed under the Information Technology Act, 2000 and the rules made thereunder and the amended provisions pertaining to electronic documents/records in various statutes as amended by the Information Technology Act, 2000. This privacy policy does not require any physical, electronic or digital signature. This Privacy Policy (“Privacy Policy”) discloses the privacy practices for Incture Innovations Private Limited (“Incture”, “We” or “Us”) with regard to Your (“You” or “Your”) use of the online platform www.incture.com (“Site”). By visiting this Website you agree to be bound by the terms and conditions of this Privacy Policy. If you do not agree please do not use or access our Website. By mere use of the Website, you expressly consent to our use and disclosure of your personal information in accordance with this Privacy Policy. This Privacy Policy is incorporated into and subject to the Terms of Use. This document is published and shall be construed in accordance with the provisions of the Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011 under Information Technology Act, 2000; that require publishing of the privacy policy for collection, use, storage and transfer of sensitive personal data or information. Please read this privacy policy carefully."
			);
		},

		onTermsandCond: function (oEvent) {

			var check = oEvent.getParameter("selected");
			if (check) {
				this.getView().byId("idSubmitBtn").setEnabled(true);
			} else {
				this.getView().byId("idSubmitBtn").setEnabled(false);
			}
		},

		handleUploadComplete: function (oEvent) {
			var sUrl = "/JAVA_SERVICE/visitor/addImage";
			var sResponse = oEvent.getParameter(sUrl);
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] == "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}

				MessageToast.show(sMsg);
			}
		},
		handleUploadPress: function () {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.upload();
		}
		// handleValidationError: function (oEvent) {
		// 	var input = this.getView().byId("idfName").getValue();
		// 	var regexp = '^[A-Za-z]*$';
		// 	 var isValid = input.search(regexp);
			
		// 	oEvent.getSource().setValueState(oEvent.getParameter("oldValue"));
		// },
		// handleValidationSuccess: function (oEvent) {
		// 	var input = this.getView().byId("idfName").getValue();
		// 	var regexp = '^[A-Za-z]*$';
		// 	 var isValid = input.search(regexp);
		// 	oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
		// }

	});

});