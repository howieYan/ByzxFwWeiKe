import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    ScrollView,
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
export default class SelectBank extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: [],
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/getBanks');
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result.list,
                })
            } else {
                Loading.Toast(data.message);
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
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.content]}>
                    <ScrollView>
                        <View style={styles.SelectBankMain}>
                            {this.renderList()}
                        </View>
                    </ScrollView>

                </View>
            </View>
        );
    }
    renderList () {
        let List = [];
        this.state.data.forEach((v, i) => {
            List.push(
                <TouchableOpacity activeOpacity={0.8} onPress={this.OnSelectBank.bind(this, v.bc_bank_name)} key={i}>
                    <View style={styles.SelectBank}>
                        {/*<Image source={v.icon} style={styles.SelectBankIcon}/>*/}
                        <View style={{flex: 1}}>
                            <Text style={styles.SelectBankText}>{v.bc_bank_name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
        return List;
    }
    // 返回
    onBackButton (record) {
        if (typeof(record) === 'string') {
            this.props.navigation.state.params.ReceiveCode(record)
        }
        this.props.navigation.goBack();
    }
    // 选择银行卡
    OnSelectBank (record) {
        this.onBackButton(record);
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
    // 内容:
    SelectBankMain: {
        paddingRight: 10,
        paddingLeft: 10,
    },
    SelectBank: {
        flexDirection: 'row',
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    SelectBankIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    SelectBankText: {
        paddingLeft: 10,
        color: '#000000',
        fontSize: Utils.setSpText(16),
    }
});

