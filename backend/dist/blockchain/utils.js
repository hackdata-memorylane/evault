export function getBlockValueFromParameter(parameter, block) {
    switch (parameter) {
        case "uid":
            return block.data.autodata.uid;
        case "timestamp":
            return block.data.autodata.timestamp.toString();
        case "prevHash":
            return block.data.constructordata.prevHash;
        case "file":
            return block.data.constructordata.file.name;
        case "pk":
            return block.data.constructordata.pk;
        case "nextPk":
            return block.data.constructordata.nextPk;
        case "nonce":
            return block.data.nonce.toString();
        case "signature":
            return block.signature;
        case "hash":
            return block.hash;
    }
}
