/*
 * Copyright 2018-2019, https://beingtechie.io.
 *
 * File: UserAuthToken.java
 * Date: May 5, 2018
 * Author: Thribhuvan Krishnamurthy
 */
package com.upgrad.bookmyconsultation.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.ZonedDateTime;


/**
 * User Entity JPA mapping class.
 **/
@Data
@Entity
@Table(name = "user_auth_token", schema = "public") // Specify schema and table name
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;

	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "email_id")
	private User user;

	@Column(name = "access_token", length = 1000)
	private String accessToken;

	@Column(name = "login_at")
	private ZonedDateTime loginAt;

	@Column(name = "expires_at")
	private ZonedDateTime expiresAt;

	@Column(name = "logout_at")
	private ZonedDateTime logoutAt;
}
