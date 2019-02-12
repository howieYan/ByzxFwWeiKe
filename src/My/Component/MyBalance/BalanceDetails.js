/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Animated, AsyncStorage, ScrollView} from 'react-native';
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";

export default class BalanceDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            size: 1000,
            total: null,
            data: [],
        }
    }


    componentDidMount() {
        this.LoadData()
    }
    async LoadData() {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);

            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/getRechargeRecord', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result.list,
                    total: data.result.total
                })
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e)
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
                                source={require('../../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1}
                                   style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <ScrollView>
                        {this.renderList()}
                    </ScrollView>
                </View>
            </View>
        );
    }
    renderList () {
        let List = [];
        let {data} = this.state;
        if (data.length > 0) {
            data.forEach((v, i) => {
                List.push(
                    <View style={styles.cell} key={i}>
                        <Text style={styles.cellLeft}>{v.rr_created}</Text>
                        <Text style={styles.cellRight}>{v.rr_amount}</Text>
                    </View>
                )
            })
        }
        return List;
    }
    // 返回
    onBackButton() {
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
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        paddingTop: (Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerRightText: {
        color: '#36b9c8',
        fontSize: Utils.setSpText(14),
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
        flexDirection: 'row-reverse',
    },
    cell: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
    },
    cellLeft: {
        flex: 1,
        color: '#000',
        fontSize: Utils.setSpText(16),
    },
    cellRight: {
        color: '#333',
        paddingRight: 15,
        fontSize: Utils.setSpText(13),
    }
})


