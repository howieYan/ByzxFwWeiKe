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
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";
export default class ChangePwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwd: '',
            newPwd: '',
            orpwd2: '',

        }
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
                                source={require('../../../Image/Back.png')}
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
                <View style={[styles.content]}>
                    <View style={styles.main}>
                        <View style={styles.mainList}>
                            <View style={{width: 100,}}>
                                <Text style={styles.mainListText}>原密码</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.UserInput}
                                    onChangeText={(text) => this.setState({pwd: text})}
                                    value={this.state.pwd}
                                    placeholder={'输入旧密码'}
                                    secureTextEntry={true}
                                />
                            </View>
                        </View>
                        <View style={styles.mainList}>
                            <View style={{width: 100,}}>
                                <Text style={styles.mainListText}>新密码</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.UserInput}
                                    onChangeText={(text) => this.setState({newPwd: text})}
                                    value={this.state.newPwd}
                                    secureTextEntry={true}
                                    placeholder={'新密码(6-20位数字和字母组合)'}
                                />
                            </View>
                        </View>
                        <View style={styles.mainList}>
                            <View style={{width: 100,}}>
                                <Text style={styles.mainListText}>确认密码</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.UserInput}
                                    onChangeText={(text) => this.setState({orpwd2: text})}
                                    value={this.state.orpwd2}
                                    secureTextEntry={true}
                                    placeholder={'再次输入新密码'}
                                />
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnChangePwd.bind(this)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack();
        Loading.hidden();
    }
    // 完成
    OnChangePwd () {
        if (!this.state.pwd) {
            Loading.Toast('旧密码不能为空');
        } else if (!this.state.newPwd){
            Loading.Toast('新密码不能为空');
        } else if (!this.state.orpwd2){
            Loading.Toast('重复新密码不能为空');
        } else if (this.state.orpwd2 !== this.state.newPwd){
            Loading.Toast('您的新密码和重复新密码不一致');
        } else {
            this.LoadData();
        }
    }
    async LoadData () {
        try {
            let formData = new FormData();
            let Uid = await AsyncStorage.getItem('uId');
            formData.append('uId', Uid);
            formData.append('pwd', this.state.pwd);
            formData.append('newPwd', this.state.newPwd);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/editPwd', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('修改密码成功');
                this.onBackButton();
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
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerRightText: {
        color: '#36b9c8',
        fontSize: Utils.setSpText(14),
    },
    swipoutLineBgColor: {
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(16),
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
    main: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
    },
    mainList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    mainListText: {
        color: '#000',
        fontSize: Utils.setSpText(16),
    },
    UserInput: {
        height: 40,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#4189D5',
        height: 50,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: Utils.setSpText(16),
    }
});

