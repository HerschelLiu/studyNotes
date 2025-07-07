```ts
/** 封装小程序获取图片信息-例如图片高度信息，用于canvas绘制比例计算 */
export function useImageInfo(src: string): Promise<UniApp.GetImageInfoSuccessData> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success(res: UniApp.GetImageInfoSuccessData) {
        resolve(res);
      },
      fail(error: any) {
        reject(error);
      },
    });
  });
}

/** 封装小程序下载图片 */
export function useDownloadImage(imgUrl: string, canvas?: any): Promise<CanvasImageSource | string> {
  return new Promise(async (resolve, reject) => {
    if (!canvas) {
      uni.downloadFile({
        url: imgUrl,
        success(res) {
          if (res.statusCode === 200) resolve(res.tempFilePath);
          reject();
        },
        fail() {
          reject();
        },
      });
    } else {
      try {
        const { width, height } = await useImageInfo(imgUrl);
        // 创建离屏 canvas 实例,仅微信小程序平台支持
        const _canvas = uni.createOffscreenCanvas({ type: '2d', width, height });
        const img = (_canvas as any).createImage();
        img.src = imgUrl;
        if (img.complete) {
          resolve(img);
        } else {
          img.onload = () => {
            resolve(img);
          };
          img.onerror = () => {
            reject(Error('创建canvas图片对象失败.'));
          };
        }
      } catch (error) {
        reject(Error('创建canvas图片对象失败'));
      }
    }
  });
}

/** 保存图片到相册 */
export const useSaveImageToPhotosAlbum = (img: string): Promise<void> => {
  const authSetting = {} as UniApp.AuthSetting;

  uni.getSetting({
    success(res: { authSetting: UniApp.AuthSetting }) {
      Object.assign(authSetting, res.authSetting);
    },
  });

  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: '保存中',
    });
    uni.saveImageToPhotosAlbum({
      filePath: img,
      success() {
        uni.hideLoading();
        uni.showToast({
          title: '保存成功',
          icon: 'none',
        });
        
        resolve()
      },
      fail: async () => {
        if (authSetting['scope.writePhotosAlbum'] === false) {
          uni.showToast({
            title: '未授权访问相册权限时无法保存图片到手机',
            icon: 'none',
          });
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'none',
          });
        }
        
        reject()
      },
      complete: () => {
        uni.hideLoading();
      },
    });
  });
};

```

