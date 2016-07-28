# wpscan / HOWTO

How can you protect your WordPress installation? Here are some best practices to protect against attackers. It's no rocket science.


### 1. Prevent file access
----
##### 1.1 Hide WordPress, system & sensitive files

Insert the following code in your `.htaccess` file:

```apacheconf
<FilesMatch "(^\.|wp-config(-sample)*\.php)">
    order deny,allow
    deny from all
</FilesMatch>
```

This code prohibits access to WordPress configuration files and sensitive system files e.g. `.htaccess`, `.htpasswd`, `.ssh` and others.

If you don't use the [Database Optimizing](https://codex.wordpress.org/Editing_wp-config.php#Automatic_Database_Optimizing) and [Post-by-Email](https://codex.wordpress.org/Post_to_your_blog_using_email) features, turn off the access too:

```apacheconf
<FilesMatch "(repair|wp-mail)\.php">
    order deny,allow
    deny from all
</FilesMatch>
```

Putting it all together:

```apacheconf
<FilesMatch "(^\.|(repair|wp-mail|wp-config(-sample)*)\.php)">
    order deny,allow
    deny from all
</FilesMatch>
```


##### 1.2 Hide LOG and TXT files

Prevent browser and search engines to request `.log` (e.g. [WP DEBUG LOG](https://codex.wordpress.org/Debugging_in_WordPress#WP_DEBUG_LOG)) and `.txt` (e.g. [plugins readme](https://wordpress.org/plugins/about/readme.txt)) files. **Must be placed in `/wp-content/.htaccess`**

```apacheconf
<FilesMatch "\.(log|txt)$">
    order allow,deny
    deny from all
</FilesMatch>
```


### 2. Protect wp-admin
-----
##### 2.1 Basic access authentication

If possible, set up an access protection for the WordPress login page. Create a `.htpasswd` file ([htpasswd Generator](http://www.htaccesstools.com/htpasswd-generator/) will help you) and add this code snippet to your `.htaccess` file:

```apacheconf
<Files wp-login.php>
    AuthName "Welcome to admin area"
    AuthType Basic
    AuthUserFile /path/to/.htpasswd
    require valid-user
</Files>
```

##### 2.2 Administration over HTTPS

[Admin area](https://codex.wordpress.org/Administration_Over_SSL) or - better - the complete WordPress site. Do it!
