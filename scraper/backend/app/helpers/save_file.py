import os

static = "static"


def save_file(file, folderName: str = "", fileName: str = None):
    file_name = fileName + ".txt"
    path = os.path.join(static, folderName)
    if not os.path.exists(path):
        os.makedirs(path)

    file_path = os.path.join(path, file_name)
    with open(file_path, "w") as f:
        f.write(file.file.read().decode("utf-8"))

    return file_name
