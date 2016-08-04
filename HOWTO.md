# wpscan / HOWTO

How can you protect your WordPress installation? Here are some best practices to protect against attackers. It's no rocket science.


### 1. Prevent file access
----
Filter name: `sensitive-files`

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
Filter name: `wp-login`

##### 2.1 Basic access authentication

If possible, set up an access protection for the WordPress login page. Create a `.htpasswd` file ([htpasswd Generator](http://www.htaccesstools.com/htpasswd-generator/) will help you) and paste this code snippet in your `.htaccess` file:

```apacheconf
<Files wp-login.php>
    AuthName "Welcome to admin area"
    AuthType Basic
    AuthUserFile /path/to/.htpasswd
    require valid-user
</Files>
```

##### 2.2 Administration over HTTPS

Secure your [Admin area](https://codex.wordpress.org/Administration_Over_SSL) or - better - the complete WordPress site. Thanks [Let's Encrypt](https://letsencrypt.org)HTTPS is now really easy. Ask your hoster.


### 3. Don't show PHP errors
-----
Filter name: `fpd-vulnerability`

The [Full Path Disclosure](https://www.owasp.org/index.php/Full_Path_Disclosure) (FPD) vulnerability allows the hacker to identify the file/root path. To turn the actual display of errors off, add the following snippet to the `.htaccess` file:

```apacheconf
<IfModule mod_php5.c>
    php_flag display_errors off
</IfModule>
```

Modify `mod_php5.c` to `mod_php7.c` if PHP7 is installed on your server.


### 4. Prevent directory listing
-----
Filter name: `directory-listing`

Depending on the [Apache configuration](https://wiki.apache.org/httpd/DirectoryListings) your visitors can get a directory listing of all the files in a folder. To prevent this mistake add the following line to your `.htaccess` file:

```apacheconf
Options -Indexes
```


### Nice to have

##### Move WordPress default folders

* [wp-content](https://codex.wordpress.org/Editing_wp-config.php#Moving_wp-content_folder)
* [plugins](https://codex.wordpress.org/Editing_wp-config.php#Moving_plugin_folder)
* [themes](https://codex.wordpress.org/Editing_wp-config.php#Moving_themes_folder)
* [uploads](https://codex.wordpress.org/Editing_wp-config.php#Moving_uploads_folder)
