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
import Utils from "../Store/Utils";
import {Loading} from '../Component/Loading';
import DeviceInfo from "react-native-device-info";
export default class LoginPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            pwd: '',
            code: '',
            CodeName: '获取验证码',
        };
    }
    componentDidMount () {
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
                                source={require('../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <View style={styles.LoginHeader}>
                        <Image style={styles.LoginHeaderIcon} source={require('../Image/Login/AppLogo.png')}/>
                        <View style={styles.LoginInput}>
                            <Image style={styles.LoginInputUser} source={require('../Image/Login/UserName.png')}/>
                            <View style={styles.LoginInputRight}>
                                <View style={{
                                    borderBottomColor: '#F2F1F2',
                                    borderBottomWidth: 1 }}>
                                    <TextInput
                                        style={styles.textInputs}
                                        maxLength={11}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) =>this.setState({mobile: text})}
                                        value={this.state.mobile}
                                        placeholder={'请输入您的手机号'}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.LoginInput}>
                            <Image style={styles.LoginInputUser} source={require('../Image/Login/Code.png')}/>
                            <View style={styles.LoginInputRight}>
                                <View style={{
                                    borderBottomColor: '#F2F1F2',
                                    borderBottomWidth: 1 }}>
                                    <TextInput
                                        style={styles.textInputs}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) =>this.setState({code: text})}
                                        value={this.state.code}
                                        placeholder={'请输入短信验证码'}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.OnCode.bind(this)}>
                                <View style={styles.LoginInputCode}>
                                    <Text style={styles.LoginInputCodeText}>{this.state.CodeName}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.LoginInput}>
                            <Image style={styles.LoginInputUserPwd} source={require('../Image/Login/Pwd.png')}/>
                            <View style={styles.LoginInputRight}>
                                <View style={{
                                    borderBottomColor: '#F2F1F2',
                                    borderBottomWidth: 1 }}>
                                    <TextInput
                                        style={styles.textInputs}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) =>this.setState({pwd: text})}
                                        value={this.state.pwd}
                                        secureTextEntry={true}
                                        placeholder={'设置新密码'}
                                    />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnLogin.bind(this)}>
                            <View style={styles.LoginButton}>
                                <Text style={styles.LoginButtonText}>登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack()
    }
    // 获取验证码
    OnCode () {
        if (this.state.mobile) {
            let time = 60;
            this.LoadCode();
            let _this = this;
            let int = setInterval(function () {
                time --;
                _this.setState({
                    CodeName: '重新获取' + (time) + 's后',
                })
                if (time === 0) {
                    _this.setState({
                        CodeName: '获取验证码',
                    })
                    clearInterval(int);
                }
            }, 1000);
        } else {
            Loading.Toast('手机号码不能为空')
        }
    }
    // 获取验证码接口
    async LoadCode () {
        try {
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/auth/getCode', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('验证码已发送')
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 登录
    OnLogin () {
        if (!this.state.mobile) {
            Loading.Toast('手机号码不能为空')
        } else if (!this.state.code) {
            Loading.Toast('验证码不能为空')
        } else if (!this.state.pwd) {
            Loading.Toast('新密码不能为空')
        } else {
            this.LoadLogin()
        }
    }
    async LoadLogin () {
        try {
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            formData.append('deviceId', DeviceInfo.getUniqueID());
            formData.append('pwd', this.state.pwd);
            formData.append('code', this.state.code);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/auth/findPwd', formData);
            if (Number(data.code) === 0) {
                AsyncStorage.setItem('uId', data.result.u_id);
                this.props.navigation.navigate('TabBar');
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
        backgroundColor: '#fff',
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 1,
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(17),
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
    LoginHeader: {
        paddingTop: 40,
        paddingRight: 50,
        paddingLeft: 50,
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    LoginHeaderIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    LoginInput: {
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    LoginInputUser: {
        width: 28,
        height: 28,
    },
    LoginInputUserPwd: {
        width: 28,
        height: 28,
    },
    LoginInputRight: {
        paddingLeft: 10,
        flex: 1,
    },
    textInputs: {
        height: 40,
    },
    LoginButton: {
        marginTop: 40,
        width: Utils.size.width - 100,
        backgroundColor: '#4189D5',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        borderColor: '#468BD6',
        borderWidth: 1,
    },
    LoginButtonText: {
        fontSize: Utils.setSpText(18),
        color: '#fff',
        fontWeight: 'bold',
    },
    LoginBottom: {
        paddingTop: 10,
        flexDirection: 'row',
    },
    LoginBottomLeft: {
        color: '#0080D4',
        fontSize: Utils.setSpText(16),
    },
    LoginInputCode: {
        borderWidth: 1,
        borderColor: '#7FB8E5',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    LoginInputCodeText: {
        paddingLeft: 10,
        paddingRight: 10,
        color: '#7FB8E5',
        fontSize: Utils.setSpText(15),
    }
});

