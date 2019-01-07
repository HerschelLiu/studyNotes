```javascript
<input name="file" id="ifile" onchange="imgPreview(this)" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">


function imgPreview(fileDom) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
                //获取文件
                var file = fileDom.files[0];
                var imageType = /^image\//;
                //是否是图片
                if (!imageType.test(file.type)) {
                    alert("请选择图片！");
                    return;
                }
                //读取完成
                reader.onload = function (e) {
                    e = e || window.event;
                    //读取完成后，数据保存在对象的result属性中
                };
                reader.readAsDataURL(file);//不加他就获取不到文件
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }

        }
```

方法

FileReader提供了如下方法：

| readAsArrayBuffer(file)   | 按字节读取文件内容，结果用ArrayBuffer对象表示 |
| ------------------------- | --------------------------------------------- |
| readAsBinaryString(file)  | 按字节读取文件内容，结果为文件的二进制串      |
| readAsDataURL(file)       | 读取文件内容，结果用data:url的字符串形式表示  |
| readAsText(file,encoding) | 按字符读取文件内容，结果用字符串形式表示      |
| abort()                   | 终止文件读取操作                              |

readAsDataURL和readAsText较为常用，这里只对这两者进行说明。

readAsDataURL会将文件内容进行base64编码后输出

事件

| onabort     | 当读取操作被中止时调用               |
| ----------- | ------------------------------------ |
| onerror     | 当读取操作发生错误时调用             |
| onload      | 当读取操作成功完成时调用             |
| onloadend   | 当读取操作完成时调用，无论成功或失败 |
| onloadstart | 当读取操作开始时调用                 |
| onprogress  | 在读取数据过程中周期性调用           |

## 解决上传竖屏图片，缺旋转90度的问题

用

[exif-js](https://github.com/exif-js/exif-js/)

### api方法

| 名称                        | 说明                                                         |
| --------------------------- | ------------------------------------------------------------ |
| EXIF.getData(img, callback) | 获取图像的数据能兼容尚未支持提供 EXIF 数据的浏览器获取到元数据。 |
| EXIF.getTag(img, tag)       | 获取图像的某个数据                                           |
| EXIF.getAllTags(img)        | 获取图像的全部数据，值以对象的方式返回                       |
| EXIF.pretty(img)            | 获取图像的全部数据，值以字符串的方式返回                     |

## EXIF 标识

| 名称                       | 说明                           |
| -------------------------- | ------------------------------ |
| ExifVersion                | Exif 版本                      |
| FlashPixVersion            | FlashPix 版本                  |
| ColorSpace                 | 色域、色彩空间                 |
| PixelXDimension            | 图像的有效宽度                 |
| PixelYDimension            | 图像的有效高度                 |
| ComponentsConfiguration    | 图像构造                       |
| CompressedBitsPerPixel     | 压缩时每像素色彩位             |
| MakerNote                  | 制造商设置的信息               |
| UserComment                | 用户评论                       |
| RelatedSoundFile           | 关联的声音文件                 |
| DateTimeOriginal           | 创建时间                       |
| DateTimeDigitized          | 数字化创建时间                 |
| SubsecTime                 | 日期时间（秒）                 |
| SubsecTimeOriginal         | 原始日期时间（秒）             |
| SubsecTimeDigitized        | 原始日期时间数字化（秒）       |
| ExposureTime               | 曝光时间                       |
| FNumber                    | 光圈值                         |
| ExposureProgram            | 曝光程序                       |
| SpectralSensitivity        | 光谱灵敏度                     |
| ISOSpeedRatings            | 感光度                         |
| OECF                       | 光电转换功能                   |
| ShutterSpeedValue          | 快门速度                       |
| ApertureValue              | 镜头光圈                       |
| BrightnessValue            | 亮度                           |
| ExposureBiasValue          | 曝光补偿                       |
| MaxApertureValue           | 最大光圈                       |
| SubjectDistance            | 物距                           |
| MeteringMode               | 测光方式                       |
| Lightsource                | 光源                           |
| Flash                      | 闪光灯                         |
| SubjectArea                | 主体区域                       |
| FocalLength                | 焦距                           |
| FlashEnergy                | 闪光灯强度                     |
| SpatialFrequencyResponse   | 空间频率反应                   |
| FocalPlaneXResolution      | 焦距平面X轴解析度              |
| FocalPlaneYResolution      | 焦距平面Y轴解析度              |
| FocalPlaneResolutionUnit   | 焦距平面解析度单位             |
| SubjectLocation            | 主体位置                       |
| ExposureIndex              | 曝光指数                       |
| SensingMethod              | 图像传感器类型                 |
| FileSource                 | 源文件                         |
| SceneType                  | 场景类型（1 == 直接拍摄）      |
| CFAPattern                 | CFA 模式                       |
| CustomRendered             | 自定义图像处理                 |
| ExposureMode               | 曝光模式                       |
| WhiteBalance               | 白平衡（1 == 自动，2 == 手动） |
| DigitalZoomRation          | 数字变焦                       |
| FocalLengthIn35mmFilm      | 35毫米胶片焦距                 |
| SceneCaptureType           | 场景拍摄类型                   |
| GainControl                | 场景控制                       |
| Contrast                   | 对比度                         |
| Saturation                 | 饱和度                         |
| Sharpness                  | 锐度                           |
| DeviceSettingDescription   | 设备设定描述                   |
| SubjectDistanceRange       | 主体距离范围                   |
| InteroperabilityIFDPointer |                                |
| ImageUniqueID              | 图像唯一ID                     |

### Tiff相关

| 名称                        | 说明                 |
| --------------------------- | -------------------- |
| ImageWidth                  | 图像宽度             |
| ImageHeight                 | 图像高度             |
| BitsPerSample               | 比特采样率           |
| Compression                 | 压缩方法             |
| PhotometricInterpretation   | 像素合成             |
| Orientation                 | 拍摄方向             |
| SamplesPerPixel             | 像素数               |
| PlanarConfiguration         | 数据排列             |
| YCbCrSubSampling            | 色相抽样比率         |
| YCbCrPositioning            | 色相配置             |
| XResolution                 | X方向分辨率          |
| YResolution                 | Y方向分辨率          |
| ResolutionUnit              | 分辨率单位           |
| StripOffsets                | 图像资料位置         |
| RowsPerStrip                | 每带行数             |
| StripByteCounts             | 每压缩带比特数       |
| JPEGInterchangeFormat       | JPEG SOI 偏移量      |
| JPEGInterchangeFormatLength | JPEG 比特数          |
| TransferFunction            | 转移功能             |
| WhitePoint                  | 白点色度             |
| PrimaryChromaticities       | 主要色度             |
| YCbCrCoefficients           | 颜色空间转换矩阵系数 |
| ReferenceBlackWhite         | 黑白参照值           |
| DateTime                    | 日期和时间           |
| ImageDescription            | 图像描述、来源       |
| Make                        | 生产者               |
| Model                       | 型号                 |
| Software                    | 软件                 |
| Artist                      | 作者                 |
| Copyright                   | 版权信息             |

### GPS相关

| 名称                | 说明             |
| ------------------- | ---------------- |
| GPSVersionID        | GPS 版本         |
| GPSLatitudeRef      | 南北纬           |
| GPSLatitude         | 纬度             |
| GPSLongitudeRef     | 东西经           |
| GPSLongitude        | 经度             |
| GPSAltitudeRef      | 海拔参照值       |
| GPSAltitude         | 海拔             |
| GPSTimeStamp        | GPS 时间戳       |
| GPSSatellites       | 测量的卫星       |
| GPSStatus           | 接收器状态       |
| GPSMeasureMode      | 测量模式         |
| GPSDOP              | 测量精度         |
| GPSSpeedRef         | 速度单位         |
| GPSSpeed            | GPS 接收器速度   |
| GPSTrackRef         | 移动方位参照     |
| GPSTrack            | 移动方位         |
| GPSImgDirectionRef  | 图像方位参照     |
| GPSImgDirection     | 图像方位         |
| GPSMapDatum         | 地理测量资料     |
| GPSDestLatitudeRef  | 目标纬度参照     |
| GPSDestLatitude     | 目标纬度         |
| GPSDestLongitudeRef | 目标经度参照     |
| GPSDestLongitude    | 目标经度         |
| GPSDestBearingRef   | 目标方位参照     |
| GPSDestBearing      | 目标方位         |
| GPSDestDistanceRef  | 目标距离参照     |
| GPSDestDistance     | 目标距离         |
| GPSProcessingMethod | GPS 处理方法名   |
| GPSAreaInformation  | GPS 区功能变数名 |
| GPSDateStamp        | GPS 日期         |
| GPSDifferential     | GPS 修正         |

解决：

这里主要`用到Orientation属性。`
Orientation属性说明如下：

 

| 旋转角度  | 参数 |
| --------- | ---- |
| 0°        | 1    |
| 顺时针90° | 6    |
| 逆时针90° | 8    |
| 180°      | 3    |

```
var Orientation = null;


EXIF.getData(file, function() { 
           // alert(EXIF.pretty(this)); 
            EXIF.getAllTags(this);  
            //alert(EXIF.getTag(this, 'Orientation'));  
            Orientation = EXIF.getTag(this, 'Orientation'); 
            //return; 
        }); 
        
        /如果方向角不为1，都需要进行旋转 added by lzk 
                    if(Orientation != "" && Orientation != 1){ 
                        alert('旋转处理'); 
                        switch(Orientation){ 
                            case 6://需要顺时针（向左）90度旋转 
                                alert('需要顺时针（向左）90度旋转'); 
                                rotateImg(this,'left',canvas); 
                                break; 
                            case 8://需要逆时针（向右）90度旋转 
                                alert('需要顺时针（向右）90度旋转'); 
                                rotateImg(this,'right',canvas); 
                                break; 
                            case 3://需要180度旋转 
                                alert('需要180度旋转'); 
                                rotateImg(this,'right',canvas);//转两次 
                                rotateImg(this,'right',canvas); 
                                break; 
                        }        
                    } 
```

