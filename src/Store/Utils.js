import React, {Component} from 'react';
import { Platform, Dimensions, PixelRatio,} from 'react-native';
import axios from 'axios';
import moment from 'moment';
//  1、feach
//  2、获取屏幕的高度
//  3、获取最小线宽
export default  {
    size: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        os: Platform.OS,
        // url: 'https://www.bywk.qcdqnet.com/'
        url: 'https://bywk360.cn/'
    },
    formatTs (ts, format = 'YYYY-MM-DD HH:mm') {
        let time = moment.unix(ts);
        let retVal = time.format(format);
        // debug && console.debug(`${ts} => ${retVal}(${time.format()})`)
        return retVal;
    },
    scale(uiWidth) {
        const screenWidth = this.size.width < this.size.height ? this.size.width : this.size.height
        return Math.floor((screenWidth / 375) * uiWidth)
    },
    pixel: 1 / PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
    setSpText(size) {
        let scale = Math.min(this.size.height / this.size.height,  this.size.width / this.size.width);
        size = Math.round((size * scale + 0.5) * PixelRatio.get() / PixelRatio.getFontScale());
        return size / PixelRatio.get();
    },
    LoadPost (url, params, callback) {
        return new Promise((resolve, reject) => {
            try {
                axios({
                    method: 'POST',
                    url: url,
                    data: params,
                    params: params,
                    headers: {
                        // 'Content-Type': 'multipart/form-data',
                        // 'platform' : Platform.OS
                    }
                })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(new Error('通讯异常，请检查网络或稍后重试。'));
                    });
            }
            catch (e) {
                console.error(`Exception: ${e}`);
                reject(e);
            }
        });
    },
    LoadGet (url, params) {
        return new Promise((resolve, reject) => {
            try {
                axios({
                    method: 'GET',
                    url: url,
                    data: params,
                    params: params,
                    headers: {
                        // 'platform' : Platform.OS
                    }
                })
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(new Error('通讯异常，请检查网络或稍后重试。'));
                    });
            }
            catch (e) {
                console.error(`Exception: ${e}`);
                reject(e);
            }
        });
    },
    // 验证手机号码
    isMobile(str) {
        let myreg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        if (str.length === 0 || str === null) {
            return 1;
        } else if (!myreg.test(str)) {
            return 2;
        } else {
            return 3;
        }
    },
    isEmail(str) {
        let myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (str.length === 0 || str === null) {
            return 1;
        } else if (!myreg.test(str)) {
            return 2;
        } else {
            return 3;
        }
    },
    uploadImage(imageUri, imageName, question) {
        console.log(imageUri)
        console.log(imageName)
        return new Promise((resolve, reject) => {
            let data = new FormData()
            if (imageUri) {
                data.append('filename', { uri: imageUri, name: imageName, type: 'image/jpg' })//加入图片
                data.append('fileType', question)//加入图片
            }
            console.log(data);
            const config = {
                method: 'POST',
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data,
            }
            fetch(this.size.url + '/v1/settings/upload', config)
                .then(function (response) {
                    return response.json();
                }).then((responseData) => {
                console.log('responseData', responseData);
                resolve(responseData)
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    //post请求
    post (url, data, callback) {
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                callback(responseJson);
                // callback(responseText);
            }).done();
    },
}
