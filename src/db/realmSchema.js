import Realm from "realm";

const DocumentSchema = {
    name: "Document",
    primaryKey: "id",
    properties: {
        id: "int",
        name: "string",
        filePath: "string",
        createdAt: "string",
        createdDate: "string",
        createdTime: "string",
        updatedAt: "string",
        updatedDate: "string",
        updatedTime: "string",
        lastOpened: "string",
        deleted: "int",
        starred: { type: "bool", default: false },
    },
};

const realm = new Realm({ schema: [DocumentSchema] });

export default realm;
