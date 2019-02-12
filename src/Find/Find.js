import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Utils from "../Store/Utils";
import Book from './Component/Book';
import OnLine from './Component/OnLine';
export default class BookAcademy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActiver: false,
        }
    }

    componentDidMount () {
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <View style={styles.header}>
                        {/*<View style={styles.headerLeft}/>*/}
                        <View style={styles.headerCenter}>
                            <TouchableOpacity activeOpacity={0.8}
                                              navigator={this.props.navigator}
                                              onPress={this.onHeaderLeftButton.bind(this)}>
                                <View style={[this.state.isActiver ? styles.headerCenterLeft : styles.headerCenterLeftActive]}>
                                    <Text style={[this.state.isActiver ? styles.headerCenterLeftTextActive : styles.headerCenterLeftText ]}>书院课堂</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8}
                                              navigator={this.props.navigator}
                                              onPress={this.onHeaderRightButton.bind(this)}>
                                <View style={[!this.state.isActiver ? styles.headerCenterRight : styles.headerCenterRightActive]}>
                                    <Text style={[!this.state.isActiver ? styles.headerCenterLeftTextActive : styles.headerCenterLeftText]}>在线问答</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/*<View style={styles.headerRight} >*/}
                            {/**/}
                                {/*<Image source={require('../Image/FindHeaderRigh.png')} style={styles.FindHeaderRigh}/>*/}
                                {/*<Text style={styles.headerRightText}>提问</Text>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                    </View>
                </View>
                <View style={styles.content}>
                    {
                        this.state.isActiver ?
                            <OnLine navigation={this.props.navigation}/>
                            :
                            <Book navigation={this.props.navigation}/>
                    }
                </View>
            </View>
        );
    }
    onHeaderRightButton () {
        this.setState({
            isActiver: true,
        })
        this.forceUpdate()
    }
    onHeaderLeftButton () {
        this.setState({
            isActiver: false,
        })
        this.forceUpdate()
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
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerCenterLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 30,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#0089DD',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    headerCenterRight : {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 30,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#0089DD',
    },
    headerCenterLeftActive: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        width: 80,
        height: 30,
        backgroundColor: '#0089DD',
        borderWidth: 1,
        borderColor: '#0089DD',
    },
    headerCenterRightActive: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        width: 80,
        height: 30,
        backgroundColor: '#0089DD',
        borderWidth: 1,
        borderColor: '#0089DD',
    },
    headerCenterLeftText: {
        fontSize: Utils.setSpText(15),
        color: '#fff',
        fontWeight: 'bold',
    },
    headerCenterLeftTextActive: {
        fontSize: Utils.setSpText(15),
        color: '#0089DD',
        fontWeight: 'bold',
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    headerRightText: {
        color: '#777',
        fontSize: Utils.setSpText(13),
    },
    // 内容
    UserDetailsImg: {
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
    FindHeaderRigh: {
        width: 20,
        height: 20,
    }
});

