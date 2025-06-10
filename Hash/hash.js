document.getElementById('hash_file').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;

        document.getElementById("file_name").innerHTML = "" + file.name;

        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = function () {
            var hash = 0x55555555;
            var bytes = new Uint8Array(reader.result);
            for (let i = 0; i < bytes.length; i++) {
                hash = (hash >>> 27) + (hash << 5) + bytes[i];
            }
            document.getElementById("result_hash").innerHTML = "" + hash;
            document.getElementById("results").style.display = "block";
        };

        document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
});