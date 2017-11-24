import React, { Component } from 'react'
import {Button,Form,Input,Row,Col,message,Tooltip} from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import md5 from 'md5'
import './App.css'

const FormItem = Form.Item;

class InputUnit extends Component {



}
const WrappedInputUnit = Form.create()(InputUnit);

class App extends Component {
    state={
        copyText: ''
    }

    handleMakeSign = ()=>{
        this.props.form.validateFields((err, values) => {
            if(err){
                return
            }
            try{
                const json = this.props.form.getFieldValue('json')
                const key = this.props.form.getFieldValue('key')

                let obj = JSON.parse(json);
                if(obj['sign']){
                    delete obj.sign
                    console.log(obj)
                    message.info('已经自动剔除自带sign');
                }

                const jsonFormat = JSON.stringify(obj,null,4)
                this.props.form.setFieldsValue({'json':jsonFormat});
                const keyArr = Object.keys(obj).sort()
                let signStr = '';
                keyArr.forEach((item)=>{
                    signStr +=  '&' + item + '=' + obj[item];
                })
                signStr = signStr.substring(1) + '&key=' + key;
                this.props.form.setFieldsValue({'signStr':signStr});
                const sign = md5(signStr);
                this.props.form.setFieldsValue({'sign':sign});
                this.state.copyText = sign;
                obj['sign'] = sign;
                const result = JSON.stringify(obj,null,4)
                this.props.form.setFieldsValue({'result':result});
            }catch(e){
                alert('JSON解析失败')
            }
        })
    }

    render(){

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItemLayout2 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        return (
            <div className="App">
                <Form >
                    <Row>
                        <Col  span={24} key={1}>
                            <FormItem {...formItemLayout} label={'JSON'}>
                                {getFieldDecorator('json', {initialValue: '', rules: [{required: true, type: "string", message: '请填写签名JSON字符串'}]})(
                                    <Input placeholder="input json string" type="textarea" autosize onChange={this.handleJsonChange} style={{minHeight:"100px"}}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col  span={24} key={2}>
                            <FormItem {...formItemLayout} label={'key'}>
                                {getFieldDecorator('key', {initialValue: '', rules: [{required: true, type: "string", message: '请填写签名密钥值'}]})(
                                    <Input placeholder="请填写签名密钥值" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24} key={3} >
                            <Button type="primary" className="signBtn" onClick={this.handleMakeSign}>生成签名</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col  span={24} key={4}>
                            <FormItem {...formItemLayout} label={'signStr'}>
                                {getFieldDecorator('signStr', {initialValue: '', rules: [{required: false, type: "string"}]})(
                                    <Input placeholder="签名字符串" type="textarea" autosize/>
                                )}
                            </FormItem>
                        </Col>
                        <Col  span={12} key={5} >
                            <FormItem {...formItemLayout2} label={'sign'}>
                                {getFieldDecorator('sign', {initialValue: '', rules: [{required: false, type: "string"}]})(
                                    <Input placeholder="最终签名"/>

                                )}
                            </FormItem>
                        </Col>
                        <Col  span={11} key={6} offset={1}>
                            <Tooltip title="复制签名">
                                <CopyToClipboard text={this.state.copyText} ref="test" onCopy={()=>{}}>
                                    <Button type="ghost" icon="copy"></Button>
                                </CopyToClipboard>&nbsp;
                            </Tooltip>
                        </Col>
                        <Col  span={24} key={7}>
                            <FormItem {...formItemLayout} label={'result'}>
                                {getFieldDecorator('result', {initialValue: '', rules: [{required: false, type: "string"}]})(
                                    <Input placeholder="最终发送的数据" type="textarea" autosize/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default Form.create()(App)
