package com.haichun.project.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * 文件名：ResultMessage.java
 * 描述：〈返回结果实体〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/17 22:51
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultMessage {
	boolean success = true;
	String code;
	String message;
	Object data;
}
