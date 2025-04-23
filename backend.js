const SPREADSHEET_ID = '1bUoL506VOHQTciNt5Z6bKUNoid2t-HJMd0DFFF_W_nk';
const AUDITSHEET_NAME = 'audits';
const API_KEY = 'myKey';

function getDataSheet() {
    return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(AUDITSHEET_NAME);
}

function isAuth(providedKey) {
    if (providedKey == API_KEY) {
        return true
    }
    return false;
}

function jsonResponse(status, message, data = null) {
    const output = ContentService.createTextOutput(JSON.stringify({
        status: status,
        message: message,
        data: data
    })).setMimeType(ContentService.MimeType.JSON);
    Logger.log(JSON.stringify(data));
    return output;
}

function checkInputsCompletion(fieldsToFill) {
    let completionTestOK = true;
    fieldsToFill.forEach(element => {
        if (element == null) {
            completionTestOK = false;
        }
    });

    return completionTestOK;
}

function doGet(e) {
    const parameters = e.parameters;

    if (!isAuth(parameters.key)) {
        return jsonResponse(401, 'key not provided');
    }

    const dataSheet = getDataSheet();
    const datas = dataSheet.getDataRange().getValues();
    const headers = datas[0];

    let records = datas.slice(1).map((row) => {
        let obj = {}
        headers.forEach((key, indexKey) => {
            obj[key] = row[indexKey];
        }
        )
        return obj
    }
    );

    Object.entries(parameters).forEach(([key, value]) => {
        if (key != "key") {
            headers.forEach((headerKey) => {
                if (headerKey == key) {
                    records = records.filter((record) => (record[key] == value));
                }
            })

        }
    });

    if (records.length == 0) {
        return jsonResponse(200, "no record match your request");
    }
    return jsonResponse(200, "GET query OK", records)

}

function doPost(e) {
    const dataSheet = getDataSheet();
    const params = JSON.parse(e.postData.contents);
    const providedKey = params.key;

    if (!isAuth(providedKey)) {
        return jsonResponse(401, 'key not provided');
    }

    switch (params.method) {
        case 'POST':
            return handlePost(e, dataSheet);
            break;
        case 'PUT':
            return handlePut(e, dataSheet);
            break;
        case 'DELETE':
            return handleDelete(e, dataSheet);
            break;
        default:
            return jsonResponse(404, "unknown method provided in the query");
    }
}

function handlePost(e, dataSheet) {
    const params = JSON.parse(e.postData.contents);
    const idParam = Date.now();

    if (!checkInputsCompletion([params.client, params.date, params.reason, params.status, params.comment])) {
        return jsonResponse(404, 'required fiels not filled');
    }

    const rowContent = [idParam, params.client, params.date, params.reason, params.status, params.comment];

    try {
        dataSheet.appendRow(rowContent);
    } catch (error) {
        return jsonResponse(404, 'row not added' + error);
    }

    const addedAudit = {
        "id": idParam,
        "client": params.client,
        "date": params.date,
        "reason": params.reason,
        "status": params.status,
        "comment": params.comment
    };

    return jsonResponse(200, "audit created", addedAudit);

}

function handlePut(e, dataSheet) {
    const params = JSON.parse(e.postData.contents);
    let rowContent = [params.id, params.client, params.date, params.reason, params.status, params.comment];

    if (!checkInputsCompletion(rowContent)) {
        return jsonResponse(404, 'required fiedls not filled');
    }

    const lastRowIndex = dataSheet.getLastRow();
    const idRange = dataSheet.getRange(2, 1, lastRowIndex, 1);
    let indexRowToUpdate = null;
    const idValues = idRange.getValues();

    for (let i = 0; i < idValues.length; i++) {
        if (idValues[i] == params.id) {
            indexRowToUpdate = i + 2;
            dataSheet.getRange(indexRowToUpdate, 1, 1, 6).setValues([rowContent]);
        }
    }

    if (indexRowToUpdate == null) {
        return jsonResponse(404, "id to update not found");
    }

    return jsonResponse(200, "audit updated", rowContent)

}

function handleDelete(e, dataSheet) {
    const datas = dataSheet.getDataRange().getValues();
    const params = JSON.parse(e.postData.contents);
    const headers = datas[0];
    const lastRowIndex = dataSheet.getLastRow();
    const idRange = dataSheet.getRange(2, 1, lastRowIndex, 1);
    let indexRowToDelete = null;
    const deleteObj = {};
    const idValues = idRange.getValues();

    for (let i = 0; i < idValues.length; i++) {
        if (idValues[i] == params.id) {
            indexRowToDelete = i + 2;
            headers.forEach((key, indexKey) => {
                deleteObj[key] = datas[i + 1][indexKey];
            });
        }
    }

    if (indexRowToDelete == null) {
        return jsonResponse(404, "id to delete not found");
    }

    try {
        dataSheet.deleteRow(indexRowToDelete);
    } catch (error) {
        return jsonResponse(404, 'row not added' + error);
    }

    return jsonResponse(200, "audit deleted", deleteObj);

}

////////// BACK FUNCTION TO BA CALLED FROM FRONT (AS FETCH FORBIDDEN FROM WEB APP GAS  (BUT NOT FROM REACH....))//////
//
//function callApiGet(e){
//  return doGet(e);
//}