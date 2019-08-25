'''
@Description: In User Settings Edit
@Author: your name
@Date: 2019-08-22 11:58:45
@LastEditTime: 2019-08-22 17:21:30
@LastEditors: Please set LastEditors
'''
# -*- coding: utf-8 -*-
import sys
import glob
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont


def watermark(post_name):
    if post_name == 'all':
        post_name = '*'
    dir_name = 'source/_posts/' + post_name + '/*'
    for files in glob.glob(dir_name):
        im = Image.open(files)
        if len(im.getbands()) < 3:
            im = im.convert('RGB')
            print(files)
        font = ImageFont.truetype('STSONG.TTF', max(30, int(im.size[1] / 20)))
        draw = ImageDraw.Draw(im)
        draw.text((im.size[0] / 2, im.size[1] / 2),
                  u'@renbo', fill=(0, 0, 0), font=font)
        im.save(files)


if __name__ == '__main__':
    if len(sys.argv) == 2:
        watermark(sys.argv[1])
    else:
        print('[usage] <input>')