<div class="wrap">
    <h1>Content Quality Checker</h1>
    
    <?php if (empty($issues)): ?>
        <div class="notice notice-success">
            <p>No issues found! All content looks good.</p>
        </div>
    <?php else: ?>
        <div class="content-checker-results">
            <?php foreach ($issues as $post_id => $data): ?>
                <div class="content-issue-card">
                    <h2>
                        <?php echo esc_html($data['title']); ?>
                        <a href="<?php echo esc_url($data['edit_url']); ?>" class="button button-small">Edit</a>
                    </h2>
                    
                    <?php if (!empty($data['large_images'])): ?>
                        <div class="issue-section">
                            <h3>Large Images Found:</h3>
                            <ul>
                                <?php foreach ($data['large_images'] as $image): ?>
                                    <li>
                                        <strong>Size:</strong> <?php echo esc_html($image['size']); ?><br>
                                        <img src="<?php echo esc_url($image['src']); ?>" style="max-width: 200px;">
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($data['lorem_ipsum'])): ?>
                        <div class="issue-section">
                            <h3>Lorem Ipsum Found:</h3>
                            <ul>
                                <?php foreach ($data['lorem_ipsum'] as $pattern): ?>
                                    <li><?php echo esc_html($pattern); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<style>
.content-issue-card {
    background: #fff;
    padding: 20px;
    margin: 20px 0;
    border: 1px solid #ccd0d4;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
}

.issue-section {
    margin: 15px 0;
    padding: 10px;
    background: #f8f9fa;
    border-left: 4px solid #007cba;
}
</style> 