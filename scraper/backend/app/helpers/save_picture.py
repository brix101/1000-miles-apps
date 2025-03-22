import os
from uuid import uuid4
from PIL import Image

static = 'static'

def save_picture(file, folderName: str = '', fileName: str = None):
    randon_uid = str(uuid4())
    
    picture_name = f"{randon_uid}_{file.filename}"

    path = os.path.join(static,folderName)
    if not os.path.exists(path):
        os.makedirs(path)
        
    picture_path = os.path.join(path,picture_name)


    img = Image.open(file.file)

    img.save(picture_path)
    
    return picture_name