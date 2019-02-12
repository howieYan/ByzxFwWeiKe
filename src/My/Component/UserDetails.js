import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    TextInput,
    AsyncStorage,
} from 'react-native';
import Utils from "../../Store/Utils";
import  ImagePicker  from 'react-native-image-picker';
import {Loading} from "../../Component/Loading";
import AlertView from '../../Component/Alert';
export default class UserDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            avatar: '',
            alertData: {
                leftName: '',
                rightName: '',
                centerName: '',
                alertTitle: '',
                alertContent: '',
                leftClick: null,
                rightClick: null,
                centerClick: null,
            }
        }
    }
    componentDidMount () {
        this.setState({
            avatar: this.props.navigation.state.params.data.u_avatar
        })
        this.LoadUid();
    }
    async LoadUid () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            if (Uid) {
                this.setState({
                    Uid: Uid
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigator={this.props.navigator}
                                      onPress={this.onBackButton.bind(this)}>
                        <View style={styles.headerLeft}>
                            <Image
                                style={styles.messageHeaderBack}
                                source={require('../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.OnSubmit.bind(this)}>
                        <View style={styles.headerRight} >
                            <Text style={!this.state.nickname ? styles.headerRightText : styles.headerRightTextBg}>确定</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this._imagePicker.bind(this)}>
                        <View style={styles.UserDetailsImg}>
                            <Image style={styles.UserDetailsImgActaver} source={!this.state.avatar ? require('../../Image/My/UserActive.png') : {uri: this.state.avatar}}/>
                            <Text style={styles.UserDetailsActaverName}>更换头像</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.UserName}>
                        <Text style={styles.UserNameText}>昵称</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                style={styles.UserInput}
                                onChangeText={(text) => this.setState({nickname: text})}
                                value={this.state.nickname}
                                placeholder={'请输入您的昵称'}
                            />
                        </View>
                    </View>
                </View>
                {this._renderAndroidAlert()}
            </View>
        );
    }
    // 弹窗
    _renderAndroidAlert() {
        return(
            <AlertView ref='alert'
                       leftName={this.state.alertData.leftName}
                       rightName={this.state.alertData.rightName}
                       centerName={this.state.alertData.centerName}
                       alertTitle={this.state.alertData.alertTitle}
                       alertContent={this.state.alertData.alertContent}
                       leftClick={this.state.alertData.leftClick}
                       rightClick={this.state.alertData.rightClick}
                       centerClick={this.state.alertData.centerClick}
            />
        );

    }
    // 取消弹窗
    rightClick = () => {
        this.refs.alert && this.refs.alert.hideAlertView();
    }
    // 登录弹窗
    alertEvent () {
        this.setState({
            alertData: {
                leftName: '确定',
                rightName: '取消',
                alertTitle: '提示',
                alertContent: '您还没有登录，是否确定登录',
                leftClick: this.ToLogin.bind(this),
                rightClick: this.rightClick.bind(this),
            }
        })
        this.refs.alert && this.refs.alert.showDialog();
    }
    // 确定
    OnSubmit () {
        if (!this.state.Uid) {
            this.alertEvent();
        } else {
            if (!this.state.nickname) {
                Loading.Toast('昵称不能为空');
            } else {
                this.LoadData();
            }
        }
    }
    async LoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('nickname', this.state.nickname);
            formData.append('avatar', this.state.avatar);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/editUserInfo', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('修改昵称成功');
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 返回
    onBackButton () {
        if (this.state.Uid) {
            this.props.navigation.state.params.ReceiveCode()
        }
        this.props.navigation.goBack();
    }
    // 打开modal
    _imagePicker() {
        if (!this.state.Uid) {
           this.alertEvent();
        } else {
            const options = {
                //底部弹出框选项
                title: '选择图片',
                cancelButtonTitle: '取消',
                takePhotoButtonTitle: '拍照',
                chooseFromLibraryButtonTitle: '选择照片',
                cameraType: 'back',
                mediaType: 'photo',
                videoQuality: 'high',
                durationLimit: 10,
                maxWidth: 200,
                maxHeight: 200,
                quality: 0.8,
                angle: 0,
                allowsEditing: false,
                noData: false,
                storageOptions: {
                    skipBackup: true,
                    cameraRoll: true,
                }
            }
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let file;
                    if(Utils.size.OS === 'android'){
                        file = response.uri
                    }else {
                        file = response.uri.replace('file://', '')
                    }
                    this._fetchImage(response, file);
                }
            });
        }
    }
    ToLogin () {
        this.props.navigation.navigate('Login');
    }
    // 上传图片
    async _fetchImage (response, record) {
        try {
            let data = await Utils.uploadImage(Utils.size.os === 'ios' ? record : response.uri, record, 'avatar');
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    avatar: data.result.url
                })
                Loading.Toast('头像上传成功');
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
        paddingRight: 10,
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerRightText: {
        color: '#9E9E9E',
        fontSize: Utils.setSpText(14),
    },
    swipoutLineBgColor: {
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(15),
    },
    messageHeaderBack: {
        width: 20,
        height: 20,
    },
    headerLeft: {
        width: 50,
    },
    headerRight: {
        width: 50,
        flexDirection:'row-reverse',
    },
    // 内容
    UserDetailsImg: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    UserDetailsImgActaver: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    UserDetailsActaverName: {
        paddingTop: 10,
        fontSize: Utils.setSpText(14),
        color: '#101010'
    },
    UserName: {
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: '#fff',
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    UserNameText: {
        fontSize: Utils.setSpText(15),
        color: '#000'
    },
    UserInput: {
        height: 40,
        marginLeft: 10,
    },
    headerRightTextBg: {
        color: '#000',
        fontSize: Utils.setSpText(14),
    }
});

