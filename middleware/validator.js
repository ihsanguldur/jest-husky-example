function getRequiredFields(model) {
    const fields = model.getAttributes();

    const keys = Object.keys(fields);

    let requiredFields = [];
    for (const key of keys) {
        if(key !== "id" && key !== "createdAt" && key !== "updatedAt" && fields[key].allowNull === false) {
            requiredFields.push(key);
        }
    }

    return requiredFields;
}

function validator(models, where) {
    return function (req, res, next) {
        if(!Array.isArray(models)) {
            throw new Error("models must be array");
        }

        let requiredFields;
        for (const model of models) {
            if(typeof model === "undefined") {
                throw new Error("model not found");
            }

            requiredFields = getRequiredFields(model);

            for (const field of requiredFields) {
                if(typeof req[where][field] === "undefined" || req[where][field] === null || req[where][field] === "") {
                    return res.status(400).json({msg: "bad request", field: field});
                }
            }
        }

        next();
    }
}

module.exports = validator;