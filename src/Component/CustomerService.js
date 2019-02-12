import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    WebView
} from 'react-native';
import Utils from "../Store/Utils";

export default class CustomerService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            Uid: null,
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
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onSumbile.bind(this)}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}/>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <WebView
                        source={{uri: 'https://dct.zoosnet.net/LR/Chatpre.aspx?id=DCT95414534&cid=d04a63c81a4749d0a64353ae0df247fd&lng=cn&sid=fb88a472305e403db2abdfe710dd478f&p=https%3A//fx.bywk360.cn/&rf1=&rf2=&msg=&d=1541665411299'}}
                        style={{width: Utils.size.width, height: Utils.size.height}}
                    />
                </View>
            </View>
        );
    }

    // 返回
    onBackButton () {
        this.props.navigation.goBack();
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
    headerRightText: {
        fontSize: Utils.setSpText(16),
    },
    // 内容
    LoginHeader: {
        // alignItems: 'center',
        justifyContent: 'center',
    },
    LoginHeaderIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    LoginInput: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 1,
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
});

