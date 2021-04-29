server {
  listen	            80 default_server;
  server_name               {{ pdns_domain }};

  index                     index.html index.htm index.php;
  root                      {{ pdns_admin_path }};
  access_log                /var/log/nginx/pdnsadmin_access.log combined;
  error_log                 /var/log/nginx/pdnsadmin_error.log;

  client_max_body_size              10m;
  client_body_buffer_size           128k;
  proxy_redirect                    off;
  proxy_connect_timeout             90;
  proxy_send_timeout                90;
  proxy_read_timeout                90;
  proxy_buffers                     32 4k;
  proxy_buffer_size                 8k;
  proxy_set_header                  Host $host;
  proxy_set_header                  X-Real-IP $remote_addr;
  proxy_set_header                  X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_headers_hash_bucket_size    64;

  location ~ ^/static/  {
    include  /etc/nginx/mime.types;
    root {{ pdns_admin_path }}/powerdnsadmin;

    location ~*  \.(jpg|jpeg|png|gif)$ {
      expires 365d;
    }

    location ~* ^.+.(css|js)$ {
      expires 7d;
    }
  }

  location / {
    proxy_pass            http://unix:/run/pdnsadmin/socket;
    proxy_read_timeout    120;
    proxy_connect_timeout 120;
    proxy_redirect        off;
  }

}
